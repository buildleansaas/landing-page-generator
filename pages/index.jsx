// REACT + UTIL LIBRARIES
// ---------------
//
// ---------------

import { useEffect } from "react";
import Head from "next/head";
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

// COMPONENTS
// ---------------
//
// ---------------

import Dialog from "components/Dialog";
import { TextBlock } from "components/Block";

const StripSubscriptionPortalButton = () => {};

// LOCAL HELPERS
// ---------------
//
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
  ...props
}) {
  // HOOK UTILITIES
  // ---------------
  //
  // ---------------

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { showAlert } = useAlerts();

  // STYLES
  // ---------------
  //
  // ---------------

  const isDesktop = useBreakpointValue({ base: false, lg: true });
  const headingSize = useBreakpointValue({ base: "lg", sm: "xl", md: "2xl", lg: "3xl" });
  const headingHighlightSize = useBreakpointValue({ base: "lg", sm: "2xl", md: "3xl", lg: "4xl" });
  const headlingHighlightLineHeight = useBreakpointValue({ base: "2rem", sm: "3rem", md: "4.5rem" });
  const headlingLineHeight = useBreakpointValue({ base: "1.75rem", md: "4rem" });
  const footerMarginTop = useBreakpointValue({ base: 4, sm: 8, md: 12 });
  const descriptionFontSize = useBreakpointValue({ base: "xl", md: "2xl" });
  const ctaMarginBottom = useBreakpointValue({ base: 2, md: 3 });
  const navbarHeadingSize = useBreakpointValue({ base: "md" });
  const ctaButtonSize = useBreakpointValue({ base: "md", md: "lg" });

  const bodyText = {
    fontSize: "xl",
    mt: "4",
  };

  // STATE & PROPS
  // ---------------
  //
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
  } = landingPages[0]; // TODO: automatically handle A/B testing

  const { stripeTestProductId, stripeLiveProductId } = stripe;
  const { name, description, images } = product ?? {};

  // ON LOAD
  // ---------------
  //
  // ---------------

  useEffect(() => {
    if (process.env.NODE_ENV === "production" && !isEmpty(tawkTo)) {
      new TawkTo(tawkTo.accountID, tawkTo.chatID).onStatusChange((status) =>
        console.log("tawk initiated, status: ", status)
      );
    }
  }, []);

  // LOADING STATE
  // ---------------
  //
  // ---------------

  if (isLoadingProduct) {
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

  if (process.env.NODE_ENV === "development") {
    // console.log(props);
  }

  return (
    <>
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
          {!!youtube && (
            <ResponsiveEmbed src={`https://www.youtube.com/embed/${youtube}?controls=0`} allowFullScreen />
          )}
          <Heading size={headingSize} lineHeight={headlingLineHeight} textAlign="center">
            {hook}
          </Heading>
          <Heading
            color={`${colorScheme}.500`}
            size={headingHighlightSize}
            lineHeight={headlingHighlightLineHeight}
            textAlign="center"
          >
            {line}
          </Heading>
          <Text color="muted" textAlign="center" fontSize={descriptionFontSize} my={{ base: 4, md: 8 }}>
            {description}
          </Text>
          <Button colorScheme={colorScheme} mt={8} mb={ctaMarginBottom}>
            <TextBlock value={ctaText} />
          </Button>
          <TextBlock value={promo} textAlign="center" fontSize={14} mt={2} />
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
    ...(await getProjectConfig(getDomain(req))),
  },
});
