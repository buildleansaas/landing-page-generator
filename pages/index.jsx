import { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import axios from "axios";

import {
  Avatar,
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
} from "@chakra-ui/react";
import { FiMenu } from "react-icons/fi";

const PRODUCTS = [
  {
    test: {
      key: "prod_LlP82vwLfVC206",
    },
    production: {
      key: "prod_LlP82vwLfVC206",
    },
  },
];

export const THIS_ENV = process.env.NODE_ENV === "development" ? "test" : "prod";

export const getAllProductKeys = () =>
  Object.values(PRODUCTS)
    .map((p) => p[THIS_ENV].key)
    .filter(Boolean);

export default function Home({
  hook = "SaaS Prelaunch Pages",
  line = "Have Never Been Easier",
  ctaText,
  footerLink,
  companyName = "Build Lean SaaS",
  colorScheme = "blue",
}) {
  const isDesktop = useBreakpointValue({ base: false, lg: true });

  const [loadingProducts, setLoadingProducts] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    (async () => {
      setProducts(
        await axios.get("/api/stripe/products", {
          params: { ids: getAllProductKeys() },
        })
      );
      setLoadingProducts(false);
    })();
  }, []);

  const headingSize = useBreakpointValue({ base: "lg", sm: "xl", md: "2xl", lg: "3xl" });
  const headingHighlightSize = useBreakpointValue({ base: "lg", sm: "2xl", md: "3xl", lg: "4xl" });
  const headlingHighlightLineHeight = useBreakpointValue({ base: "2rem", sm: "3rem", md: "4.5rem" });
  const headlingLineHeight = useBreakpointValue({ base: "1.75rem", md: "4rem" });
  const footerMarginTop = useBreakpointValue({ base: 4, sm: 8, md: 12 });
  const descriptionFontSize = useBreakpointValue({ base: "xl", md: "2xl" });
  const ctaMarginBottom = useBreakpointValue({ base: 2, md: 3 });
  const navbarHeadingSize = useBreakpointValue({ base: "md" });

  if (loadingProducts) {
    return (
      <Flex align="center" justify="center" height="100vh" width="100vw">
        <Spinner size="xl" />
      </Flex>
    );
  }

  const { prices, name, description, images } = products?.data?.[0] ?? {};

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
            <Image src={images[0]} height={42} width={42} alt={`${name} Logo`} />
            <VStack>
              <Heading size={navbarHeadingSize} fontWeight={400} ml={2}>
                {name}
              </Heading>
            </VStack>
          </HStack>
          {isDesktop && (
            <ButtonGroup ml="auto" variant="ghost-on-accent" spacing="1">
              <Button fontWeight={300} _hover={{ fontWeight: 500, color: `${colorScheme}.500` }}>
                About
              </Button>
              <Button fontWeight={300} _hover={{ fontWeight: 500, color: `${colorScheme}.500` }}>
                Roadmap
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
          <Button colorScheme={colorScheme} size="lg" width="100%" maxW="320" mt={8} mb={ctaMarginBottom}>
            Just <chakra.strike mx={1}>$50</chakra.strike> $10/year!
          </Button>
          <Text textAlign="center" mt={2}>
            {ctaText ?? (
              <>
                Unlock Lifetime Access 80% off, Code{" "}
                <chakra.pre display="inline" background="yellow.200" py={1} px={2}>
                  UAJL6i37
                </chakra.pre>{" "}
                automatically applied at checkout!
              </>
            )}
          </Text>
          <Text textAlign="center" fontSize={14} mt={2} color="gray.500">
            Only available to the <u>next 100 users</u>!
          </Text>
        </Flex>
        <chakra.footer mt={footerMarginTop}>
          <Link
            href={footerLink ?? "https://buildleansaas.com"}
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
      </Box>
    </>
  );
}
