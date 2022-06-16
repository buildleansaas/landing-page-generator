import React from "react";
import { Box, useBreakpointValue } from "@chakra-ui/react";
import SocialLinks from "./SocialLinks";
import { Copyright } from "./Copyright";

export default function Footer({ companyName, companyLink, socialLinks, colorScheme }) {
  const footerMarginTop = useBreakpointValue({ base: 4, sm: 6, md: 8 });
  return (
    <Box as="footer" width="100%" role="contentinfo" mx="auto" mt={footerMarginTop} color="black">
      <Copyright
        colorScheme={colorScheme}
        companyName={companyName}
        companyLink={companyLink}
        textAlign="center"
        mb={2}
      />
      <SocialLinks {...{ socialLinks }} />
    </Box>
  );
}
