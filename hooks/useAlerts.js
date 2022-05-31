import { useToast } from "@chakra-ui/react";

export default function useAlerts() {
  const toast = useToast();
  const showAlert = ({
    title = "",
    description = "",
    status = "success",
    duration = 4000,
    isClosable = true,
  }) =>
    toast({
      title,
      description,
      status,
      duration,
      isClosable,
      position: "top-right",
    });

  return {
    showAlert,
  };
}
