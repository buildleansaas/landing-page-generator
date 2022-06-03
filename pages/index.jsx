// REACT + UTIL LIBRARIES
// ---------------
//
// ---------------

import { useEffect } from "react";
import NextLink from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";
import { isEmpty } from "lodash";
import Image from "next/image";
import { useQuery } from "react-query";
import {
  Box,
  Button,
  chakra,
  Flex,
  Heading,
  HStack,
  IconButton,
  Link,
  Spinner,
  Text,
  useBreakpointValue,
  VStack,
  useDisclosure,
  ButtonGroup,
} from "@chakra-ui/react";
import { FcAbout } from "react-icons/fc";
import ResponsiveEmbed from "react-responsive-embed";

// BUSINESS LOGIC LIBRARIES
// ---------------
//
// ---------------
import TawkTo from "tawkto-react";

// PROJECT CONFIGURATION
// ---------------
//
// ---------------

import { imageBuilder } from "lib/sanity";
import { getProjectConfig } from "lib/sanity/config";
import { getDomain } from "utils";
import useAlerts from "hooks/useAlerts";
import useStorage from "hooks/useStorage";

// COMPONENTS
// ---------------
//
// ---------------

import Dialog from "components/Dialog";
import { TextBlock } from "components/Block";

// LOCAL HELPERS
// ---------------
// - stripe customer constants
// - date formatter utilities
// ---------------

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const formatDate = (date) => MONTHS[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();

// LANGING PAGE RENDER
// ---------------
//
// ---------------

export default function Home({
  landingPages,
  about,
  tawkTo,
  stripe,
  footerLink,
  companyName,
  companyLogo,
  founderLink,
  founderName,
  projectName, // TODO: integrate with logging
}) {
  // HOOK UTILITIES
  // ---------------
  // - router utilities
  // - database utilities
  // - modal popup handlers
  // - alert handlers
  // ---------------

  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { showAlert } = useAlerts();

  // STYLES
  // ---------------
  // - useBreakpointValue allows us to scale up / down our styling with chakra ui with any variable
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
  const navbarHeadingSize = useBreakpointValue({ base: "md" });

  const bodyText = {
    fontSize: "xl",
    mt: "4",
  };

  // STATE & PROPS
  // ---------------
  // - product called from stripe based on sanity stripe product ids for the deployment env.
  // - landing page information destructured from sanity.
  // - product and price information destructured.
  // - database getters
  // ---------------

  const {
    isLoading: isLoadingProduct,
    error: productError,
    data: product,
  } = useQuery("product", () =>
    fetch(
      `/api/stripe/products/${
        process.env.NODE_ENV === "development" ? stripeTestProductId : stripeLiveProductId
      }`
    ).then((res) => res.json())
  );

  if (productError) {
    showAlert({ title: productError });
  }

  const {
    // strings
    hook = "SaaS Prelaunch Pages",
    line = "Have Never Been Easier",
    colorScheme = "blue",
    youtube,
    // sanity blocks
    ctaText,
    promo,
    fomo,
    claimRewardText,
    revisionName, // TODO: integrate with logging
  } = landingPages[0]; // TODO: automatically handle A/B testing

  const { stripeTestProductId, stripeLiveProductId, activeStripeCouponCode } = stripe;
  const { name, description, images, id: productId, prices } = product ?? {};
  const price = prices?.[0];

  const mode = price?.type === "one_time" ? "payment" : "subscription";

  const [scid, setScid] = useStorage(`${companyName}|STRIPE_CUSTOMER_ID`, null);
  const [purchased, setPurchased] = useStorage(`${companyName}|${productId}|HAS_PURCAHSED`, false);

  const {
    isLoading: isLoadingStripeCustomer,
    error: stripeCustomerError,
    data: stripeCustomer,
  } = useQuery("stripeCustomer", () => fetch(`/api/stripe/customers/${scid}`).then((res) => res.json()), {
    enabled: !!scid,
  });

  if (stripeCustomerError) {
    showAlert({
      status: "error",
      title: "Stripe Authorization Error",
      description: stripeCustomerError.message,
    });
  }

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
    if (!isEmpty(stripeCustomer) && !stripeCustomer?.subscriptions.length && purchased) {
      setPurchased(false);
    }
  }, [stripeCustomer]);

  // LOADING STATE
  // ---------------
  // - handle product loading
  // ---------------

  if (isLoadingProduct || isLoadingStripeCustomer) {
    return (
      <Flex align="center" justify="center" height="100vh" width="100vw">
        <Spinner size="xl" />
      </Flex>
    );
  }

  // DEVELOPMENT HELP
  // ---------------
  //
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

  return (
    <>
      {process.env.NODE_ENV === "development" && (
        <Box
          width="100%"
          p={2}
          background="blue.500"
          {...{ display: "flex", align: "center", justify: "around" }}
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
        <title>{name}</title>
        <meta name="description" content={description} />
        {/* TODO: make favicon */}
        <link rel="icon" href="/favicon.ico" />
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
              src={images?.[0] ?? "https://placekitten.com/42/42"}
              height={42}
              width={42}
              alt={`${name} Logo`}
            />
            <VStack>
              <Heading size={navbarHeadingSize} fontWeight={400} ml={2}>
                {name}
              </Heading>
            </VStack>
          </HStack>
          {isDesktop ? (
            <Button
              variant="ghost"
              leftIcon={<FcAbout />}
              fontWeight={300}
              _hover={{ fontWeight: 500, color: `${colorScheme}.500` }}
              onClick={onOpen}
            >
              About
            </Button>
          ) : (
            <IconButton
              variant="ghost"
              icon={<FcAbout />}
              fontSize={24}
              _hover={{ fontWeight: 500, color: `${colorScheme}.500` }}
              onClick={onOpen}
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
            {hook}
          </Heading>

          {/* LINE */}
          <Heading
            color={`${colorScheme}.500`}
            size={headingHighlightSize}
            lineHeight={headlingHighlightLineHeight}
            textAlign="center"
          >
            {line}
          </Heading>

          {/* SINKER */}
          <Text color="muted" textAlign="center" fontSize={descriptionFontSize} my={{ base: 4, md: 8 }}>
            {description}
          </Text>

          {/* BITE */}
          <ButtonGroup spacing="2" mt={ctaMarginTop} mb={ctaMarginBottom}>
            {purchased && scid && (
              <NextLink href={`/claim?${scid}`} passHref>
                <Button leftIcon="⭐️" colorScheme="blue">
                  {claimRewardText}
                </Button>
              </NextLink>
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
            href={footerLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 400,
            }}
          >
            Powered by {companyName}
            <span style={{ marginLeft: "0.5rem" }}>
              <Image
                src={imageBuilder(companyLogo).width(32).url()}
                alt={`${companyName} Logo`}
                width={32}
                height={32}
              />
            </span>
          </Link>
        </chakra.footer>
        <Dialog
          {...{
            onClose,
            isOpen,
            title: `About ${name}`,
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
            <Link href={founderLink} target="_blank" rel="noopener">
              {founderName}
            </Link>
          </Text>
          <TextBlock value={about} />
        </Dialog>
      </Box>
    </>
  );
}

export const getServerSideProps = async ({ req }) => ({
  props: {
    ...(await getProjectConfig(await getDomain(req))),
  },
});
