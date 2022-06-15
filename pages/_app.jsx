import { useEffect, useState } from "react";
import Router from "next/router";
import { ChakraProvider, Box, Fade, Spinner } from "@chakra-ui/react";

import { SessionProvider } from "next-auth/react";

export default function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const start = () => {
      console.log("start");
      setLoading(true);
    };
    const end = () => {
      console.log("findished");
      setLoading(false);
    };
    Router.events.on("routeChangeStart", start);
    Router.events.on("routeChangeComplete", end);
    Router.events.on("routeChangeError", end);
    return () => {
      Router.events.off("routeChangeStart", start);
      Router.events.off("routeChangeComplete", end);
      Router.events.off("routeChangeError", end);
    };
  }, []);
  return (
    <ChakraProvider>
      {loading ? (
        <Box
          {...{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100vw",
            height: "100vh",
          }}
        >
          <Fade in>
            <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="black" size="xl" />
          </Fade>
        </Box>
      ) : (
        <SessionProvider session={session}>
          <Component {...pageProps} />
        </SessionProvider>
      )}
    </ChakraProvider>
  );
}
