import { Link, Text } from "@chakra-ui/react";
import * as React from "react";

export const Copyright = ({ companyName, companyLink, colorScheme, ...props }) => (
  <Text fontSize="sm" {...props}>
    &copy; {new Date().getFullYear()}{" "}
    <Link color={`${colorScheme}.500`} href={companyLink} isExternal>
      {companyName}
    </Link>
    . All rights reserved.
  </Text>
);
