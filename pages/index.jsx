// REACT + UTIL LIBRARIES
// ---------------

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { isEmpty } from "utils";
import { Box, Button, chakra, Flex, Heading, Link, Text, useBreakpointValue } from "@chakra-ui/react";
import ResponsiveEmbed from "react-responsive-embed";
import { loadStripe } from "@stripe/stripe-js";
import { getSession, signIn } from "next-auth/react";
import { getUserByEmail } from "queries/user";

// PROJECT CONFIGURATION
// ---------------

import { getProjectConfig } from "lib/sanity/config";
import { stripe } from "lib/api/stripe";

import { getDomain, formatDate } from "utils";

import useAlerts from "hooks/useAlerts";

// COMPONENTS
// ---------------

import Dialog from "components/Dialog";
import Block from "components/Block";
import Layout from "components/Layout";

// LANGING PAGE RENDER
// ---------------

export default function Home({ siteConfig = {}, user = {}, funnel = {}, prices = [], hasPurchased }) {
  // DESTRUCTURING
  // ---------------
  const { about, tawkTo, stripe, google, founderInfo, productInfo, socialInfo } = siteConfig;
  const { sharedProductDescription, sharedProductLogo, sharedProductSlogan, sharedProductName } =
    productInfo;
  const { community, socialLinks } = socialInfo;
  const { companyName, founderLink, founderName, companyFooterLink: companyLink } = founderInfo;
  // TODO: extend for the type (destructuring is based upon this)
  const {
    revisionName,
    // strings
    hook,
    line,
    colorScheme,
    youtube,
    // sanity blocks
    ctaText,
    signupCtaText,
    signupTeaser,
    signupReward,
    defaultAuth,
    promo,
    fomo,
    seo,
    rewardText,
  } = funnel; // TODO: automatically handle A/B testing https://www.plasmic.app/blog/nextjs-ab-testing
  const { activeStripeCouponCode } = stripe;

  const price = prices?.[0]; // TODO: expand price selection options

  // HOOK UTILITIES
  // ---------------

  const router = useRouter();
  const { showAlert } = useAlerts();
  const isDesktop = useBreakpointValue({ base: false, lg: true });

  // STATE & PROPS
  // ---------------

  const mode = price?.type === "one_time" ? "payment" : "subscription";

  // FUNCTIONS
  // --------------

  const [preparingCheckout, setPreparingCheckout] = useState(false);
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC);
  const handleStripeCheckout = async () => {
    setPreparingCheckout(true);
    const stripe = await stripePromise;
    const checkoutSession = await fetch("/api/stripe/checkout", {
      method: "POST",
      body: JSON.stringify({
        price_id: price?.id,
        coupon: activeStripeCouponCode,
        mode,
      }),
    }).then((res) => res.json());

    const result = await stripe.redirectToCheckout({
      sessionId: checkoutSession.id,
    });

    if (result.error) {
      showAlert({ title: result.error.message });
    }

    setPreparingCheckout(false);
  };

  // ON LOAD
  // ---------------

  useEffect(() => {
    if (router.isReady) {
      if (router.query.success) {
        showAlert({
          title: "Thank You For Your Support!",
          description: "Check your email to get started!",
        });
      }
    }

    if (router.query.cancelled) {
      // TODO: prompt user feedback
    }
  }, [router.isReady]);

  // DIALOG
  // ---------------

  const [activeDialog, setActiveDialog] = useState("");
  const getActiveModalTitle = () => {
    switch (activeDialog) {
      case "about":
        return `About ${sharedProductName}`;
      case "claim":
        return `Accessing Your Rewards`;
      case "signupReward":
        return `Enjoy these Freebies`;
    }
  };

  const getActiveModalContent = () => {
    switch (activeDialog) {
      case "about":
        return about;
      case "claim":
        return rewardText;
      case "signupReward":
        return signupReward;
    }
  };

  // STYLES
  // ---------------

  const headingSize = useBreakpointValue({ base: "lg", sm: "xl", md: "2xl", lg: "3xl" });
  const headingHighlightSize = useBreakpointValue({ base: "lg", sm: "2xl", md: "3xl", lg: "4xl" });
  const headlingHighlightLineHeight = useBreakpointValue({ base: "2rem", sm: "3rem", md: "4.5rem" });
  const headlingLineHeight = useBreakpointValue({ base: "1.75rem", md: "4rem" });
  const descriptionFontSize = useBreakpointValue({ base: "xl", md: "2xl" });
  const ctaMarginTop = useBreakpointValue({ base: 4, md: 8 });
  const ctaMarginBottom = useBreakpointValue({ base: 2, md: 3 });

  const bodyText = {
    fontSize: "xl",
    mt: "4",
  };

  const sharedCtaButtonStyles = {
    m: 2,
    ...(!isDesktop && { width: "100%" }),
  };

  const ctaButtonTextProps = { fontSize: 16, fontWeight: 500 };

  return (
    <Layout
      {...{
        id: revisionName,
        seo,
        loading: preparingCheckout,
        tawkTo,
        google,
        colorScheme,
        socialInfo,
        companyName,
        companyLink,
        sharedProductName,
        sharedProductLogo,
        sharedProductName,
        sharedProductSlogan,
        community,
        socialLinks,
        user,
      }}
    >
      <Flex flex="1" flexDir="column" alignItems="center" justify="center" maxW={888} margin="0 auto">
        {/* VIDEO_SALES_LETTER */}
        {!!youtube && (
          <ResponsiveEmbed src={`https://www.youtube.com/embed/${youtube}?controls=0`} allowFullScreen />
        )}

        {/* HOOK */}
        <Heading size={headingSize} lineHeight={headlingLineHeight} textAlign="center">
          {hook} {/* TODO: make hook array, if multi length, Typewriter Effect */}
        </Heading>

        {/* LINE */}
        <Heading
          color={`${colorScheme}.500`}
          size={headingHighlightSize}
          lineHeight={headlingHighlightLineHeight}
          textAlign="center"
        >
          {line} {/* TODO: make line array, if multi length, Typewriter Effect */}
        </Heading>

        {/* SINKER */}
        <Block
          value={sharedProductDescription}
          color="muted"
          textAlign="center"
          fontSize={descriptionFontSize}
          my={{ base: 4, md: 8 }}
        />

        {/* BITE */}
        <Box
          mt={ctaMarginTop}
          mb={ctaMarginBottom}
          display="flex"
          alignItems={isDesktop ? "flex-start" : "center"}
          flexWrap="wrap"
          flexDir={isDesktop ? "row" : "column"}
        >
          {hasPurchased && (
            <Button
              leftIcon="⭐️"
              colorScheme="blue"
              onClick={() => setActiveDialog("claim")}
              {...sharedCtaButtonStyles}
            >
              Claim Access
            </Button>
          )}
          {hasPurchased && mode === "subscription" && (
            <Button
              type="submit"
              leftIcon="🏦"
              onClick={() =>
                fetch(`/api/stripe/customers/portals/${user.stripeCustomerId}`, { method: "POST" })
              }
              {...sharedCtaButtonStyles}
            >
              Billing
            </Button>
          )}
          {isEmpty(user) && (
            <Button
              colorScheme={colorScheme}
              onClick={() => signIn(defaultAuth)}
              type="submit"
              {...sharedCtaButtonStyles}
            >
              <Block value={signupCtaText} {...ctaButtonTextProps} />
            </Button>
          )}
          {!hasPurchased && !isEmpty(user) && (
            <>
              <Button
                colorScheme={colorScheme}
                type="submit"
                {...sharedCtaButtonStyles}
                onClick={handleStripeCheckout}
              >
                <Block value={ctaText} {...ctaButtonTextProps} />
              </Button>
              <Button
                leftIcon="🎁"
                colorScheme="gray"
                onClick={() => setActiveDialog("signupReward")}
                {...sharedCtaButtonStyles}
              >
                Freebies
              </Button>
            </>
          )}
        </Box>

        <Box maxW={600} margin="0 auto" textAlign="center">
          {isEmpty(user) && <Block value={signupTeaser} fontSize={14} />}

          {!hasPurchased && !isEmpty(user) && (
            <>
              {/* ENTICE */}
              <Block value={promo} fontSize={14} />

              {/* AGITATE */}
              <Block value={fomo} fontSize={14} color="gray.500" />
            </>
          )}
        </Box>
      </Flex>
      <Dialog
        {...{
          onClose: () => setActiveDialog(""),
          isOpen: !!activeDialog,
          title: getActiveModalTitle(),
          borderRadius: 0,
        }}
      >
        <Text {...{ ...bodyText }}>
          <chakra.span bg="yellow">
            <strong>Last Updated</strong>: {formatDate(new Date())}
          </chakra.span>
        </Text>
        <Text {...{ ...bodyText }}>
          <strong>From</strong>:{" "}
          <Link href={founderLink} target="_blank" rel="noopener">
            {founderName}
          </Link>
        </Text>
        <Block value={getActiveModalContent()} />
      </Dialog>
    </Layout>
  );
}

const EMPTY_DATA = { data: [] };

export const getServerSideProps = async ({ req, res }) => {
  res.setHeader("Cache-Control", "public, s-maxage=10, stale-while-revalidate=59");

  const { funnels, stripe: stripeKeys, ...siteConfig } = await getProjectConfig(await getDomain(req));
  const productId =
    process.env.NODE_ENV === "development"
      ? stripeKeys.stripeTestProductId
      : stripeKeys.stripeLiveProductId;

  const session = await getSession({ req });

  const user = session?.user?.email ? await getUserByEmail(session?.user?.email) : {};

  const customer = user?.stripeCustomerId ? await stripe.customers.retrieve(user.stripeCustomerId) : {};

  const { data: subscriptions = [] } = customer.id
    ? await stripe.subscriptions.list({
        customer: customer.id,
        status: "active",
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

  const stripeCustomer = {
    ...customer,
    subscriptions,
  };

  const product = await stripe.products.retrieve(String(productId));

  if (isEmpty(product)) {
    return res.status(406).send({ message: "Product not found" });
  }

  const { data: prices } = await stripe.prices.list({
    limit: 100,
    product: productId,
    active: true,
  });

  if (isEmpty(prices)) {
    return res.status(406).send({ message: "Product has no prices!" });
  }

  const hasSubscription = Boolean(
    stripeCustomer?.subscriptions.find(({ plan }) => plan.product === productId)
  );

  return {
    props: {
      siteConfig: { ...siteConfig, stripe: stripeKeys },
      user,
      funnel: funnels[0],
      prices,
      hasPurchased: hasSubscription || hasPurchased.length > 0,
    },
  };
};
