import { stripe } from "lib/api/stripe";
import { getProjectConfig } from "lib/sanity/config";
import { getDomain } from "utils";

const handler = async (req, res) => {
  // https://stripe.com/docs/api/products?lang=node
  if (req.method === "POST") {
    try {
      const { id } = req.query;

      const { data: configs } = await stripe.billingPortal.configurations.list({
        limit: 100,
      });

      let configuration = (configs || [])?.find(
        (config) => config?.metadata?.name === "DEFAULT_BILLING_PAGE"
      );

      const {
        stripe: { stripeTestProductId, stripeLiveProductId },
        projectName,
      } = await getProjectConfig(await getDomain(req));

      const productResponse = await fetch(
        `${req.headers.origin}/api/stripe/products/${
          process.env.NODE_ENV === "development" ? stripeTestProductId : stripeLiveProductId
        }`
      );
      const product = await productResponse.json();
      const products = [{ product: product.id, prices: product.prices.map((price) => price.id) }];

      const defaultConfig = {
        business_profile: {
          headline: `Manage your Account with ${projectName}`,
          privacy_policy_url: `${req.headers.origin}/policy/privacy`, // TODO: create Sanity Integration
          terms_of_service_url: `${req.headers.origin}/policy/terms`, // TODO: create Sanity Integration
        },
        features: {
          customer_update: {
            enabled: true,
            allowed_updates: ["email", "address", "shipping", "tax_id", "phone"],
          },
          invoice_history: {
            enabled: true,
          },
          payment_method_update: {
            enabled: true,
          },
          subscription_cancel: {
            enabled: true,
            mode: "immediately",
            cancellation_reason: {
              enabled: true,
              options: [
                "too_expensive",
                "missing_features",
                "switched_service",
                "unused",
                "customer_service",
                "too_complex",
                "low_quality",
                "other",
              ],
            },
          },
          subscription_update: {
            enabled: true,
            products,
            default_allowed_updates: ["price", "promotion_code"],
          },
        },
        metadata: {
          name: "DEFAULT_BILLING_PAGE",
        },
        default_return_url: req.headers.origin,
      };

      if (!configuration) {
        configuration = await stripe.billingPortal.configurations.create(defaultConfig);
      } else {
        delete defaultConfig["metadata"];
        configuration = await stripe.billingPortal.configurations.update(configuration.id, defaultConfig);
      }

      const session = await stripe.billingPortal.sessions.create({
        customer: id,
        return_url: `${req.headers.origin}`,
        configuration: configuration.id,
      });

      return res.redirect(303, session.url);
    } catch (e) {
      res.status(500).send({ message: e.message });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};

export default handler;
