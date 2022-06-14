import React, { useEffect, useState } from "react";
import Script from "next/script";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import { isEmpty } from "lodash";
import TawkTo from "tawkto-react";

import { imageBuilder } from "lib/sanity";

import { Box, Fade, useBreakpointValue, Stack, Spinner } from "@chakra-ui/react";

import useUser from "hooks/useUser";

import Navbar from "components/Navbar";
import Footer from "components/Footer";

export default function Layout({
  id,
  colorScheme,
  // integrations
  tawkTo,
  google,
  facebook,
  // social
  community,
  socialLinks,
  companyName,
  companyLink,
  sharedProductLogo,
  sharedProductName,
  sharedProductSlogan,
  seo,
  // state / auth
  loading,
  //  styling
  childSpacing = 1,
  flexChildValue = 1,
  fullWidth = false,
  // rest
  children,
}) {
  const { asPath } = useRouter();
  const { user, userIsLoading } = useUser();

  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      const tawk = new TawkTo(tawkTo.accountID, tawkTo.chatID);
      tawk.onStatusChange((status) => console.log("tawk initiated, status: ", status));
    }
  }, []);

  const SEO = {
    title: seo?.title,
    description: seo?.description,
    ...(facebook?.facebookAppId && {
      facebook: {
        appId: facebook?.facebookAppId,
      },
    }),
    openGraph: {
      title: seo?.title,
      description: seo?.description,
      type: "website",
      locale: "en_IE",
      site_name: sharedProductName,
      url: asPath,
      images: [imageBuilder(seo?.image).height(1200).width(630).url()],
    },
  };

  const wrapperMarginTop = useBreakpointValue({ base: 8 });

  return (
    <>
      <NextSeo {...SEO} />

      {/* TODO: PWA support */}

      {google.googleTagManagerId && (
        <>
          <Script
            id="gtag"
            src={`https://www.googletagmanager.com/gtag/js?id=${google.googleTagManagerId}`}
          />
          <Script
            id="init-gtag"
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
          
            gtag('config', '${google.googleTagManagerId}');
            `,
            }}
          />
        </>
      )}

      {loading || userIsLoading ? (
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
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color={`${colorScheme}.500`}
              size="xl"
            />
          </Fade>
        </Box>
      ) : (
        <Fade in>
          <Box
            {...{
              id,
              display: "flex",
              alignItems: "center",
              flexDir: "column",
              minH: "100vh",
              maxW: "8xl",
              width: "100%",
              margin: "0 auto",
              ...(!fullWidth && { p: { base: 3, md: 9, lg: 18, xl: 27 } }),
            }}
          >
            <Navbar
              {...{
                id,
                user,
                sharedProductLogo,
                sharedProductName,
                sharedProductSlogan,
                community,
                companyLink,
                colorScheme,
              }}
            />
            <Box
              width="100%"
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexDir="column"
              flex={flexChildValue}
              mt={wrapperMarginTop}
            >
              {children}
            </Box>
            <Footer {...{ socialLinks, companyName, companyLink, colorScheme }} />
          </Box>
        </Fade>
      )}
    </>
  );
}
