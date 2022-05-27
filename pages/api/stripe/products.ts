import { stripe } from "lib/api/stripe";
import { isEmpty } from "lodash";

const handler = async (req, res) => {
  // https://stripe.com/docs/api/products?lang=node
  try {
    const { data: products } = await stripe.products.list({
      ids: [Object.values(req.query)[0]],
    });

    if (isEmpty(products)) {
      return res.status(406).send({ message: "Products not found" });
    }
    const { data: prices } = await stripe.prices.list({
      limit: 100,
    });

    return res.status(200).send(
      products?.map((product) => ({
        ...product,
        prices: (prices ?? [])?.filter((price) => {
          if (price?.product === product?.id) {
            return true;
          }
        }),
      }))
    );
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
};

export default handler;
