import React from "react";

import { Box, Button } from "@chakra-ui/react";

export default function SocialLinks({ socialLinks }) {
  return (
    <Box
      display="flex"
      flexDir="row"
      flexWrap="wrap"
      justifyContent="center"
      alignItems={{ base: "center", lg: "center" }}
    >
      {socialLinks?.map(({ href, title }) => {
        return (
          <Button key={href} as="a" href={href} rel="noopener" target="_blank" size="xs" m={0.5}>
            {title}
          </Button>
        );
      })}
    </Box>
  );
}
