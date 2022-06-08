import { ChakraProvider, Spinner, Flex } from "@chakra-ui/react";
import { Suspense } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }) {
  return (
    <Suspense
      fallback={
        <Flex align="center" justify="center" height="100vh" width="100vw">
          <Spinner size="xl" />
        </Flex>
      }
    >
      <QueryClientProvider client={queryClient}>
        <ChakraProvider>
          <Component {...pageProps} />
        </ChakraProvider>
      </QueryClientProvider>
    </Suspense>
  );
}

export default MyApp;
