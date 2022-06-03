import { stripe } from "lib/api/stripe";
import { isEmpty, isEqual } from "lodash";

const handler = async (req, res) => {
  // https://stripe.com/docs/api/products?lang=node
  try {
    const { id } = req.query;

    const customer = await stripe.customers.retrieve(id);

    const { data: subscriptions } = await stripe.subscriptions.list({
      customer: customer.id,
      status: "active",
    });

    return res.status(200).send({ ...customer, ...(subscriptions && { subscriptions }) });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
};

export default handler;
