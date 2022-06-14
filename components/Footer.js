import React from "react";
import { Box, useBreakpointValue, Text } from "@chakra-ui/react";
import SocialLinks from "components/SocialLinks";
import { Copyright } from "components/Copyright";

export default function Footer({ companyName, companyLink, socialLinks, colorScheme }) {
  const footerMarginTop = useBreakpointValue({ base: 4, sm: 6, md: 8 });
  return (
    <Box as="footer" width="100%" role="contentinfo" mx="auto" mt={footerMarginTop} color="black">
      <Copyright
        colorScheme={colorScheme}
        mb={4}
        companyName={companyName}
        companyLink={companyLink}
        textAlign="center"
      />
      <Text textAlign="center" mb={2} fontSize={12} color="gray.500">
        Follow us on...
      </Text>
      <SocialLinks {...{ socialLinks }} />
    </Box>
  );
}
