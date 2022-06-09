// REACT + UTIL LIBRARIES
// ---------------

import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { isEmpty } from "utils";
import Image from "next/image";
import {
  Box,
  Button,
  ButtonGroup,
  chakra,
  Flex,
  Heading,
  HStack,
  IconButton,
  Link,
  Spinner,
  Text,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import ResponsiveEmbed from "react-responsive-embed";

// BUSINESS LOGIC LIBRARIES
// ---------------

import TawkTo from "tawkto-react";

// PROJECT CONFIGURATION
// ---------------

import { imageBuilder } from "lib/sanity";
import { getProjectConfig } from "lib/sanity/config";
import { getDomain, formatDate } from "utils";
import useAlerts from "hooks/useAlerts";
import useStorage from "hooks/useStorage";
import useStripeProduct from "hooks/useStripeProduct";
import useStripeCustomer from "hooks/useStripeCustomer";

// COMPONENTS
// ---------------

import Dialog from "components/Dialog";
import { TextBlock } from "components/Block";

// LANGING PAGE RENDER
// ---------------

export default function Home({ siteConfig }) {
  // HOOK UTILITIES
  // ---------------

  const router = useRouter();
  const { showAlert } = useAlerts();

  // DESTRUCTURING
  // ---------------

  const {
    funnels,
    about,
    tawkTo,
    stripe,
    founderInfo,
    productInfo,
    projectName, // TODO: integrate with logging
  } = siteConfig ?? {};

  // TODO: extend for the type (destructuring is based upon this)
  const {
    // strings
    hook,
    line,
    colorScheme = "blue",
    youtube,
    // sanity blocks
    ctaText,
    promo,
    fomo,
    seo,
    rewardText,
  } = funnels[0]; // TODO: automatically handle A/B testing https://www.plasmic.app/blog/nextjs-ab-testing

  const { stripeTestProductId, stripeLiveProductId, activeStripeCouponCode } = stripe;

  // STYLES
  // ---------------

  const isDesktop = useBreakpointValue({ base: false, lg: true });

  const headingSize = useBreakpointValue({ base: "lg", sm: "xl", md: "2xl", lg: "3xl" });
  const headingHighlightSize = useBreakpointValue({ base: "lg", sm: "2xl", md: "3xl", lg: "4xl" });
  const headlingHighlightLineHeight = useBreakpointValue({ base: "2rem", sm: "3rem", md: "4.5rem" });
  const headlingLineHeight = useBreakpointValue({ base: "1.75rem", md: "4rem" });
  const footerMarginTop = useBreakpointValue({ base: 4, sm: 8, md: 12 });
  const descriptionFontSize = useBreakpointValue({ base: "xl", md: "2xl" });
  const ctaMarginTop = useBreakpointValue({ base: 4, md: 8 });
  const ctaMarginBottom = useBreakpointValue({ base: 2, md: 3 });
  const navbarHeadingSize = useBreakpointValue({ base: "xl", md: "2xl" });
  const navbarSubheadingSize = useBreakpointValue({ base: "sm", md: "md" });

  const bodyText = {
    fontSize: "xl",
    mt: "4",
  };

  // STATE & PROPS
  // ---------------

  const { isLoadingProduct, product } = useStripeProduct({
    productId: process.env.NODE_ENV === "development" ? stripeTestProductId : stripeLiveProductId,
  });

  const { id: productId, prices } = product ?? {};
  const price = prices?.[0]; // TODO: expand price selection options
  const mode = price?.type === "one_time" ? "payment" : "subscription";

  const [scid, setScid] = useStorage(`${founderInfo.companyName}|STRIPE_CUSTOMER_ID`, null);
  const [purchased, setPurchased] = useStorage(
    `${founderInfo.companyName}|${productId}|HAS_PURCAHSED`,
    false
  );

  const { isLoadingStripeCustomer, stripeCustomer } = useStripeCustomer({
    scid,
  });

  // DIALOG
  // ---------------

  const [activeDialog, setActiveDialog] = useState("");
  const getActiveModalTitle = () => {
    switch (activeDialog) {
      case "about":
        return `About ${productInfo.sharedProductName}`;
      case "claim":
        return `We're Glad to Have You Here!`;
    }
  };

  const getActiveModalContent = () => {
    switch (activeDialog) {
      case "about":
        return about;
      case "claim":
        return rewardText;
    }
  };

  // ON LOAD
  // ---------------
  // - Manage stripe payment confirmations / cancellations
  // - Init Tawk.to
  // ---------------

  useEffect(() => {
    if (router.isReady) {
      if (router.query.scid) {
        setScid(router.query.scid);

        if (router.query.success) {
          showAlert({
            title: "Thank You For Your Support!",
            description: "Check your email to get started!",
          });

          // TODO: attach to candymail / candytxt

          // TODO: verify customer actively paying for, or has purchased,
          //  otherwise they can potentially bypass getting to the reward with a fake
          // - stripe customer id: string;
          // - success: true
          setPurchased(true);
        }
      }
    }

    if (router.query.cancelled) {
      // TODO: prompt user feedback
    }
  }, [router.isReady]);

  useEffect(() => {
    if (process.env.NODE_ENV === "production" && !isEmpty(tawkTo)) {
      new TawkTo(tawkTo.accountID, tawkTo.chatID).onStatusChange((status) =>
        console.log("tawk initiated, status: ", status)
      );
    }
  }, []);

  useEffect(() => {
    if (!isEmpty(stripeCustomer) && !stripeCustomer?.subscriptions?.length && purchased) {
      setPurchased(false);
    }
  }, [stripeCustomer]);

  // DEVELOPMENT HELP
  // ---------------

  const clearLocalStorage = () => {
    setScid(null);
    setPurchased(false);
  };

  if (process.env.NODE_ENV === "development") {
    // console.log(props);
    // console.log("stripeCustomerId, ", scid);
    // console.log("hasPurchased, ", purchased);
    // console.table(stripeCustomer);
  }

  // LOADING STATE
  // ---------------
  if (isLoadingProduct || isLoadingStripeCustomer) {
    return (
      <Flex align="center" justify="center" height="100vh" width="100vw">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <>
      {process.env.NODE_ENV === "development" && (
        <Box
          width="100%"
          p={1}
          background="blue.500"
          {...{ display: "flex", align: "center", justify: "between" }}
        >
          <Text color="white" mr="auto">
            NODE_ENV: {process.env.NODE_ENV}
          </Text>
          <Button size="xs" colorScheme="whiteAlpha" onClick={clearLocalStorage}>
            Clear Local Storage
          </Button>
        </Box>
      )}
      <Head>
        <link rel="icon" href="/favicon.ico" /> {/* TODO: make favicon */}
      </Head>
      <Box
        display="flex"
        height="100vh"
        width="100%"
        maxWidth="888px"
        margin="0 auto"
        alignItems="center"
        justifyContent="center"
        flexDir="column"
        p={{ base: 4, sm: 8, md: 12 }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
          <HStack>
            <Image
              src={imageBuilder(productInfo.sharedProductLogo).height(54).width(54).url()}
              height={54}
              width={54}
              alt={`${productInfo.sharedProductName} Logo`}
            />
            <Box pl={2} align="left">
              <Text fontSize={navbarHeadingSize} fontWeight={500}>
                {productInfo.sharedProductName}
              </Text>
              <Text fontSize={navbarSubheadingSize} fontWeight={300} mt={-1}>
                {productInfo.sharedProductSlogan}
              </Text>
            </Box>
          </HStack>
          {isDesktop ? (
            <Button
              variant="ghost"
              leftIcon={<>ℹ️</>}
              fontWeight={400}
              _hover={{ fontWeight: 500, color: `${colorScheme}.500` }}
              onClick={() => setActiveDialog("about")}
            >
              More
            </Button>
          ) : (
            <IconButton
              variant="ghost"
              icon={<>ℹ️</>}
              fontSize={24}
              _hover={{ fontWeight: 500, color: `${colorScheme}.500` }}
              onClick={() => setActiveDialog("about")}
            />
          )}
        </Box>
        <Flex flex="1" flexDir="column" alignItems="center" justify="center">
          {/* VIDEO_SALES_LETTER */}
          {!!youtube && (
            <ResponsiveEmbed src={`https://www.youtube.com/embed/${youtube}?controls=0`} allowFullScreen />
          )}

          {/* HOOK */}
          <Heading size={headingSize} lineHeight={headlingLineHeight} textAlign="center">
            {hook} {/* TODO: make hook array, if multi length, Typewriter Effect */}
          </Heading>

          {/* LINE */}
          <Heading
            color={`${colorScheme}.500`}
            size={headingHighlightSize}
            lineHeight={headlingHighlightLineHeight}
            textAlign="center"
          >
            {line} {/* TODO: make line array, if multi length, Typewriter Effect */}
          </Heading>

          {/* SINKER */}
          <TextBlock
            value={productInfo.sharedProductDescription}
            color="muted"
            textAlign="center"
            fontSize={descriptionFontSize}
            my={{ base: 4, md: 8 }}
          />

          {/* BITE */}
          <ButtonGroup spacing="2" mt={ctaMarginTop} mb={ctaMarginBottom}>
            {purchased && scid && (
              <Button leftIcon="⭐️" colorScheme="blue" onClick={() => setActiveDialog("claim")}>
                Get Access Now!
              </Button>
            )}
            {purchased && scid && mode === "subscription" ? (
              <chakra.form action={`/api/stripe/customers/portals/${scid}`} method="POST" mx={1}>
                <Button width="100%" type="submit" leftIcon="🏦">
                  Billing
                </Button>
              </chakra.form>
            ) : (
              <Box width="100%" maxW={320}>
                <chakra.form action="/api/stripe/checkout" method="POST" width="100%" maxW={320}>
                  {scid && <input type="hidden" name="scid" value={scid} />}
                  <input type="hidden" name="price_id" value={price?.id} />
                  {activeStripeCouponCode && (
                    <input type="hidden" name="coupon" value={activeStripeCouponCode} />
                  )}
                  <input type="hidden" name="mode" value={mode} />
                  <Button colorScheme={colorScheme} width="100%" type="submit">
                    <TextBlock value={ctaText} />
                  </Button>
                </chakra.form>
              </Box>
            )}
          </ButtonGroup>

          {/* ENTICE */}
          <TextBlock value={promo} textAlign="center" fontSize={14} mt={2} />

          {/* AGITATE */}
          <TextBlock value={fomo} textAlign="center" fontSize={14} mt={2} color="gray.500" />
        </Flex>
        <chakra.footer mt={footerMarginTop}>
          <Link
            href={founderInfo.footerLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 400,
            }}
          >
            Powered by {founderInfo.companyName}
            <span style={{ marginLeft: "0.5rem" }}>
              <Image
                src={imageBuilder(founderInfo.companyLogo).width(32).url()}
                alt={`${founderInfo.companyName} Logo`}
                width={32}
                height={32}
              />
            </span>
          </Link>
        </chakra.footer>
        <Dialog
          {...{
            onClose: () => setActiveDialog(""),
            isOpen: !!activeDialog,
            title: getActiveModalTitle(),
            borderRadius: 0,
          }}
        >
          <Text {...{ ...bodyText }}>
            <chakra.span bg="yellow">
              <strong>Last Updated</strong>: {formatDate(new Date())}
            </chakra.span>
          </Text>
          <Text {...{ ...bodyText }}>
            <strong>From</strong>:{" "}
            <Link href={founderInfo.founderLink} target="_blank" rel="noopener">
              {founderInfo.founderName}
            </Link>
          </Text>
          <TextBlock value={getActiveModalContent()} />
        </Dialog>
      </Box>
    </>
  );
}

export const getServerSideProps = async ({ req, res }) => {
  res.setHeader("Cache-Control", "public, s-maxage=10, stale-while-revalidate=59");

  const siteConfig = await getProjectConfig(await getDomain(req));

  return {
    props: {
      siteConfig,
    },
  };
};
