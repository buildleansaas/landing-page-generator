import { stripe } from "lib/api/stripe";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { origin } = req.headers;
    const { price_id, mode, coupon, scid } = req.body;
    const customer = scid ? { id: scid } : await stripe.customers.create();

    try {
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
        success_url: `${origin}/?success=true&scid=${customer?.id}`,
        cancel_url: `${origin}/?canceled=true&scid=${customer?.id}`,
        consent_collection: {
          promotions: "auto",
        },
        phone_number_collection: {
          enabled: true,
        },
      });
      res.redirect(303, session.url);
    } catch (err) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
