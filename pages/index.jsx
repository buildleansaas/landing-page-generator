// REACT + UTIL LIBRARIES
// ---------------

import { isEmpty } from "utils";
import { getSession } from "next-auth/react";
import { getUserByEmail } from "queries/user";
import { getUserStripeId } from "utils";

// FUNNELS
// ---------------

import HookLineSinker from "funnels/HookLineSinker";

// PROJECT CONFIGURATION
// ---------------

import { getProjectConfig } from "lib/sanity/config";
import { stripe } from "lib/api/stripe";

import { getDomain } from "utils";

// FUNNEL RENDERER
// ---------------

export default function Home({ funnel: { funnelType, ...funnel } = {}, ...props }) {
  const funnelProps = {
    funnel,
    ...props,
  };

  switch (funnelType) {
    case "hook-line-sinker":
      return <HookLineSinker {...funnelProps} />;
    default:
      return <></>;
  }
}

const EMPTY_DATA = { data: [] };

export const getServerSideProps = async ({ req, res }) => {
  res.setHeader("Cache-Control", "public, s-maxage=10, stale-while-revalidate=59");

  const { stripe: stripeKeys, ...siteConfig } = await getProjectConfig(await getDomain(req));

  const productId =
    process.env.NODE_ENV === "development"
      ? stripeKeys.stripeTestProductId
      : stripeKeys.stripeLiveProductId;

  const session = await getSession({ req });

  const dbUser = session?.user?.email ? await getUserByEmail(session?.user?.email) : {};
  const user = { ...dbUser, ...session?.user };

  const customer = getUserStripeId(user) ? await stripe.customers.retrieve(getUserStripeId(user)) : {};

  const { data: subscriptions = [] } = customer.id
    ? await stripe.subscriptions.list({
        customer: customer.id,
        status: "active",
        limit: 100,
      })
    : EMPTY_DATA;

  const { data: paymentIntents = [] } = customer.id
    ? await stripe.paymentIntents.list({
        customer: customer.id,
        limit: 100,
      })
    : EMPTY_DATA;

  // TODO: store on database somehow
  const hasPurchased = await Promise.all(
    paymentIntents
      .filter((pi) => pi.status === "succeeded")
      .map(async (paymentIntent) => {
        const { data: sessions = [] } = await stripe.checkout.sessions.list({
          payment_intent: paymentIntent.id,
        });

        const stripeSession = sessions.filter((s) => s.mode === "payment")[0] ?? {};

        if (stripeSession.status === "complete" && stripeSession.payment_status === "paid") {
          const { data: lineItems = [] } =
            sessions.length > 0 ? await stripe.checkout.sessions.listLineItems(sessions[0].id) : EMPTY_DATA;

          return Boolean(lineItems.find((lineItem) => lineItem.price.product === productId));
        } else return false;
      })
  ).then((res) => res.filter(Boolean));

  const product = await stripe.products.retrieve(String(productId));

  if (isEmpty(product)) {
    return res.status(406).send({ message: "Product not found" });
  }

  const { data: prices } = await stripe.prices.list({
    limit: 100,
    product: productId,
    active: true,
  });

  const hasSubscription = Boolean(subscriptions.find(({ plan }) => plan.product === productId));

  return {
    props: {
      siteConfig: { ...siteConfig, stripe: stripeKeys },
      user,
      funnel: siteConfig.funnels[0], // TODO: automatically handle A/B testing https://www.plasmic.app/blog/nextjs-ab-testing
      prices,
      hasPurchased: hasSubscription || hasPurchased.length > 0,
    },
  };
};
