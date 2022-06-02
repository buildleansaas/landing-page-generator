import React from "react";
import { Text, chakra } from "@chakra-ui/react";
import { PortableText } from "@portabletext/react";
import sanity from "lib/sanity";

const SHARED_COMPONENTS = {
  marks: {
    highlight: ({ children }) => (
      <chakra.pre display="inline" background="yellow.200" py={1} px={2}>
        {children}
      </chakra.pre>
    ),
  },
};

export const TextBlock = ({ value, ...textProps }) => (
  <PortableText
    value={value}
    components={{
      ...SHARED_COMPONENTS,
      block: (props) => <Text {...textProps}>{props.children}</Text>,
    }}
    {...sanity.config()}
  />
);
