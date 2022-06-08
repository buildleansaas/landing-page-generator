import { useQuery } from "react-query";

import useAlerts from "./useAlerts";

const useStripeProduct = ({ productId }) => {
  const { showAlert } = useAlerts();

  const { isLoading, error, data } = useQuery(
    "product",
    () => fetch(`/api/stripe/products/${productId}`).then((res) => res.json()),
    { enabled: !!productId }
  );

  if (error) {
    showAlert({
      status: "error",
      title: "Stripe Product Error",
      description: error.message,
    });
  }

  return {
    isLoadingProduct: isLoading,
    product: data,
  };
};

export default useStripeProduct;
