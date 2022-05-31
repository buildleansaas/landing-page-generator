// REACT + UTIL LIBRARIES
// ---------------
//
// ---------------

import { useState, useEffect } from "react";
import Head from "next/head";
import { isEmpty } from "lodash";
import Image from "next/image";
import axios from "axios";
import {
  Box,
  Button,
  chakra,
  Flex,
  Heading,
  HStack,
  IconButton,
  ButtonGroup,
  Link,
  Spinner,
  Text,
  useBreakpointValue,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { FiMenu } from "react-icons/fi";

// BUSINESS LOGIC LIBRARIES
// ---------------
//
// ---------------

import { format } from "date-fns";
import TawkTo from "tawkto-react";

// PROJECT CONFIGURATION
// ---------------
//
// ---------------

import { getProjectConfig } from "lib/sanity/config";
import { getDomain } from "utils";
import useAlerts from "hooks/useAlerts";

// COMPONENTS
// ---------------
//
// ---------------

import Dialog from "components/Dialog";
import Block from "components/Block";

const StripSubscriptionPortalButton = () => {};

// LOCAL CONSTANTS
// ---------------
//
// ---------------
export const THIS_ENV = process.env.NODE_ENV === "development" ? "test" : "prod";

// LANGING PAGE RENDER
// ---------------
//
// ---------------

export default function Home({ landingPages, about, tawkTo, stripe, ...props }) {
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

  const [firstLoad, setFirstLoad] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [products, setProduct] = useState([]);

  const {
    // strings
    hook = "SaaS Prelaunch Pages",
    line = "Have Never Been Easier",
    footerLink = "https://buildleansaas.com",
    companyName = "Build Lean SaaS",
    colorScheme = "blue",
    // sanity blocks
    ctaText,
    promo,
    fomo,
  } = landingPages[0]; // TODO: automatically handle A/B testing

  const { stripeTestProductId, stripeLiveProductId } = stripe;
  const { name, description, images } = products?.data ?? {};

  // ON LOAD
  // ---------------
  //
  // ---------------

  useEffect(() => {
    (async () => {
      if (!loadingProducts) {
        try {
          setLoadingProducts(true);
          if (firstLoad) {
            setFirstLoad(false);
          }
          setProduct(
            await axios.get(
              `/api/stripe/products/${
                process.env.NODE_ENV === "development" ? stripeTestProductId : stripeLiveProductId
              }`
            )
          );
          setLoadingProducts(false);
        } catch (err) {
          console.error(err);
          showAlert({ title: err.message });
        }
      }
    })();

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

  if (firstLoad || loadingProducts) {
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
    console.log(props);
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
          {isDesktop && (
            <ButtonGroup ml="auto" variant="ghost-on-accent" spacing="1">
              <Button
                fontWeight={300}
                _hover={{ fontWeight: 500, color: `${colorScheme}.500` }}
                onClick={onOpen}
              >
                About
              </Button>
              <Button fontWeight={300} _hover={{ fontWeight: 500, color: `${colorScheme}.500` }}>
                Subscribe
              </Button>
            </ButtonGroup>
          )}
          {!isDesktop && (
            <IconButton
              variant="ghost-on-accent"
              icon={<FiMenu fontSize="1.5rem" fontWeight={300} />}
              aria-label="Open Menu"
            />
          )}
        </Box>
        <Flex flex="1" flexDir="column" alignItems="center" justify="center">
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
          <Button colorScheme={colorScheme} size={ctaButtonSize} mt={8} mb={ctaMarginBottom}>
            {!ctaText ? (
              <>
                Early Adopter Access for <strike>$50</strike> $5/year!
              </>
            ) : (
              <Block value={ctaText} />
            )}
          </Button>
          <Text textAlign="center" mt={2}>
            {!promo ? (
              <>
                Unlock Lifetime Access 80% off, Code{" "}
                <chakra.pre display="inline" background="yellow.200" py={1} px={2}>
                  UAJL6i37
                </chakra.pre>{" "}
                automatically applied at checkout!
              </>
            ) : (
              <Block value={promo} />
            )}
          </Text>
          <Text textAlign="center" fontSize={14} mt={2} color="gray.500">
            {!fomo ? (
              <>
                This <u>code is limited</u> to the <u>first 100 users</u>!
              </>
            ) : (
              <Block value={fomo} />
            )}
          </Text>
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
              <Image src="/bls.png" alt={`${companyName} Logo`} width={32} height={32} />
            </span>
          </Link>
        </chakra.footer>
        <Dialog {...{ onClose, isOpen, title: `About ${name}` }}>
          <Box mt={12}>
            <Text {...{ ...bodyText }}>
              <chakra.span bg="yellow">
                <strong>Last Updated</strong>: {format(new Date(), "MMMM Do, yyyy")}
              </chakra.span>
            </Text>
            <Text {...{ ...bodyText }}>
              <strong>From</strong>:{" "}
              <Link href="https://twitter.com/buildleansaas" target="_blank" rel="noopener">
                @adubs
              </Link>
            </Text>
            <Block value={about} />
          </Box>
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
