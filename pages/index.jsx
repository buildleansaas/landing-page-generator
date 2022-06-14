// REACT + UTIL LIBRARIES
// ---------------

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { isEmpty } from "utils";
import { Box, Button, chakra, Flex, Heading, Link, Text, useBreakpointValue } from "@chakra-ui/react";
import ResponsiveEmbed from "react-responsive-embed";

// PROJECT CONFIGURATION
// ---------------

import { getProjectConfig } from "lib/sanity/config";

import { getDomain, formatDate } from "utils";

import useUser from "hooks/useUser";
import useAlerts from "hooks/useAlerts";
import useStripeProduct from "hooks/useStripeProduct";
import useStripeCustomer from "hooks/useStripeCustomer";

// COMPONENTS
// ---------------

import Dialog from "components/Dialog";
import Block from "components/Block";
import Layout from "components/Layout";

// LANGING PAGE RENDER
// ---------------

export default function Home({ siteConfig }) {
  const { signIn, user } = useUser();
  // HOOK UTILITIES
  // ---------------

  const router = useRouter();
  const { showAlert } = useAlerts();

  // DESTRUCTURING
  // ---------------

  const { funnels, about, tawkTo, stripe, google, founderInfo, productInfo, socialInfo } = siteConfig ?? {};

  const { sharedProductDescription, sharedProductLogo, sharedProductSlogan, sharedProductName } =
    productInfo;
  const { community, socialLinks } = socialInfo;
  const { companyName, founderLink, founderName } = founderInfo;

  // TODO: extend for the type (destructuring is based upon this)
  const {
    revisionName,
    // strings
    hook,
    line,
    colorScheme,
    youtube,
    // sanity blocks
    ctaText,
    signupCtaText,
    signupTeaser,
    signupReward,
    defaultAuth,
    promo,
    fomo,
    seo,
    rewardText,
  } = funnels[0]; // TODO: automatically handle A/B testing https://www.plasmic.app/blog/nextjs-ab-testing

  const { stripeTestProductId, stripeLiveProductId, activeStripeCouponCode } = stripe;

  // STATE & PROPS
  // ---------------

  const productId = process.env.NODE_ENV === "development" ? stripeTestProductId : stripeLiveProductId;
  const { isLoadingProduct, product } = useStripeProduct({
    productId,
  });

  const { prices } = product ?? {};
  const price = prices?.[0]; // TODO: expand price selection options
  const mode = price?.type === "one_time" ? "payment" : "subscription";

  const { isLoadingStripeCustomer, stripeCustomer } = useStripeCustomer({
    scid: user.stripeCustomerId,
  });

  const userHasPurchased = Boolean(
    stripeCustomer?.subscriptions.find(({ plan }) => plan.product === productId)
  );

  // ON LOAD
  // ---------------
  // - Manage stripe payment confirmations / cancellations
  // - Init Tawk.to
  // ---------------

  useEffect(() => {
    if (router.isReady) {
      if (router.query.success) {
        showAlert({
          title: "Thank You For Your Support!",
          description: "Check your email to get started!",
        });
      }
    }

    if (router.query.cancelled) {
      // TODO: prompt user feedback
    }
  }, [router.isReady]);

  // DIALOG
  // ---------------

  const [activeDialog, setActiveDialog] = useState("");
  const getActiveModalTitle = () => {
    switch (activeDialog) {
      case "about":
        return `About ${sharedProductName}`;
      case "claim":
        return `Accessing Your Rewards`;
      case "signupReward":
        return `Enjoy these Freebies`;
    }
  };

  const getActiveModalContent = () => {
    switch (activeDialog) {
      case "about":
        return about;
      case "claim":
        return rewardText;
      case "signupReward":
        return signupReward;
    }
  };

  // STYLES
  // ---------------

  const headingSize = useBreakpointValue({ base: "lg", sm: "xl", md: "2xl", lg: "3xl" });
  const headingHighlightSize = useBreakpointValue({ base: "lg", sm: "2xl", md: "3xl", lg: "4xl" });
  const headlingHighlightLineHeight = useBreakpointValue({ base: "2rem", sm: "3rem", md: "4.5rem" });
  const headlingLineHeight = useBreakpointValue({ base: "1.75rem", md: "4rem" });
  const descriptionFontSize = useBreakpointValue({ base: "xl", md: "2xl" });
  const ctaMarginTop = useBreakpointValue({ base: 4, md: 8 });
  const ctaMarginBottom = useBreakpointValue({ base: 2, md: 3 });

  const bodyText = {
    fontSize: "xl",
    mt: "4",
  };

  const sharedCtaButtonStyles = {
    m: 2,
    width: "100%",
  };

  const ctaButtonTextProps = { fontSize: 16, fontWeight: 500 };

  return (
    <Layout
      {...{
        id: revisionName,
        seo,
        loading:
          isLoadingProduct || isLoadingStripeCustomer || (user.stripeCustomerId && isEmpty(stripeCustomer)),
        tawkTo,
        google,
        colorScheme,
        socialInfo,
        companyName,
        sharedProductName,
        sharedProductLogo,
        sharedProductName,
        sharedProductSlogan,
        community,
        socialLinks,
      }}
    >
      <Flex flex="1" flexDir="column" alignItems="center" justify="center" maxW={888} margin="0 auto">
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
        <Block
          value={sharedProductDescription}
          color="muted"
          textAlign="center"
          fontSize={descriptionFontSize}
          my={{ base: 4, md: 8 }}
        />

        {/* BITE */}
        <Box mt={ctaMarginTop} mb={ctaMarginBottom} display="flex" alignItems="flex-start" flexWrap="wrap">
          {userHasPurchased && (
            <Button
              leftIcon="⭐️"
              colorScheme="blue"
              onClick={() => setActiveDialog("claim")}
              {...sharedCtaButtonStyles}
            >
              Claim Access
            </Button>
          )}
          {userHasPurchased && mode === "subscription" && (
            <Button
              type="submit"
              leftIcon="🏦"
              onClick={() =>
                fetch(`/api/stripe/customers/portals/${user.stripeCustomerId}`, { method: "POST" })
              }
              {...sharedCtaButtonStyles}
            >
              Billing
            </Button>
          )}
          {isEmpty(user) && (
            <Button
              colorScheme={colorScheme}
              onClick={() => signIn(defaultAuth)}
              type="submit"
              {...sharedCtaButtonStyles}
            >
              <Block value={signupCtaText} {...ctaButtonTextProps} />
            </Button>
          )}
          {!userHasPurchased && !isEmpty(user) && (
            <>
              <Button
                colorScheme={colorScheme}
                type="submit"
                {...sharedCtaButtonStyles}
                onClick={() =>
                  fetch("/api/stripe/checkout", {
                    method: "POST",
                    body: {
                      scid: user?.stripeCustomerId,
                      price_id: price?.id,
                      coupon: activeStripeCouponCode,
                    },
                  })
                }
              >
                <Block value={ctaText} {...ctaButtonTextProps} />
              </Button>
              <Button
                leftIcon="🎁"
                colorScheme="gray"
                onClick={() => setActiveDialog("signupReward")}
                {...sharedCtaButtonStyles}
              >
                Freebies
              </Button>
            </>
          )}
        </Box>

        <Box maxW={600} margin="0 auto" textAlign="center">
          {isEmpty(user) && <Block value={signupTeaser} fontSize={14} />}

          {!isEmpty(user) && (isEmpty(stripeCustomer) || !userHasPurchased) && (
            <>
              {/* ENTICE */}
              <Block value={promo} fontSize={14} />

              {/* AGITATE */}
              <Block value={fomo} fontSize={14} color="gray.500" />
            </>
          )}
        </Box>
      </Flex>
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
          <Link href={founderLink} target="_blank" rel="noopener">
            {founderName}
          </Link>
        </Text>
        <Block value={getActiveModalContent()} />
      </Dialog>
    </Layout>
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
