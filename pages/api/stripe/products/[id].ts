import { stripe } from "lib/api/stripe";
import { isEmpty } from "lodash";

// https://stripe.com/docs/api/products?lang=node
const handler = async (req, res) => {
  const { id } = req.query;

  try {
    const product = await stripe.products.retrieve(String(id));

    if (isEmpty(product)) {
      return res.status(406).send({ message: "Product not found" });
    }

    const { data: prices } = await stripe.prices.list({
      limit: 100,
      product: id,
    });

    if (isEmpty(prices)) {
      return res.status(406).send({ message: "Product has no prices!" });
    }

    return res.status(200).send({
      ...product,
      prices: (prices ?? [])?.filter((price) => {
        if (price?.product === product?.id) {
          return true;
        }
      }),
    });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
};

export default handler;
