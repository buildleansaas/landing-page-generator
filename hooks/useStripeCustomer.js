import { useQuery } from "react-query";

import useAlerts from "./useAlerts";

const useStripeCustomer = ({ scid }) => {
  const { showAlert } = useAlerts();
  const {
    isLoading: isLoadingStripeCustomer,
    error: stripeCustomerError,
    data: stripeCustomer,
  } = useQuery("stripeCustomer", () => fetch(`/api/stripe/customers/${scid}`).then((res) => res.json()), {
    enabled: Boolean(typeof scid !== "undefined"),
  });

  if (stripeCustomerError) {
    showAlert({
      status: "error",
      title: "Stripe Authorization Error",
      description: stripeCustomerError.message,
    });
  }

  return {
    isLoadingStripeCustomer,
    stripeCustomer,
  };
};

export default useStripeCustomer;
