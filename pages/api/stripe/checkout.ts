import { stripe } from "lib/api/stripe";
import { getSession } from "next-auth/react";
import { getUserByEmail, updateUser } from "queries/user";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const authSession = await getSession({ req });
      const user = await getUserByEmail(authSession.user.email);

      const { origin } = req.headers;
      const { price_id, mode, coupon } = JSON.parse(req.body);

      const customer = user?.stripeCustomerId
        ? { id: user?.stripeCustomerId }
        : await stripe.customers.create();

      if (!user.stripeCustomerId) {
        await updateUser(authSession.user.email, { stripeCustomerId: customer.id });
      }

      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price: price_id,
            quantity: 1,
          },
        ],
        ...(coupon
          ? {
              discounts: [{ coupon }],
            }
          : {
              allow_promotion_codes: true,
            }),
        customer: customer.id,
        mode: mode,
        success_url: `${origin}/?success=true`,
        cancel_url: `${origin}/?canceled=true`,
        consent_collection: {
          promotions: "auto",
        },
        phone_number_collection: {
          enabled: true,
        },
      });
      res.status(200).json({ id: session.id });
    } catch (err) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
