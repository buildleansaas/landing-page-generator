import React from "react";
import { Heading, Text, chakra, Image, useColorModeValue as mode, AspectRatio } from "@chakra-ui/react";
import { PortableText } from "@portabletext/react";
import getYouTubeId from "get-youtube-id";
import YouTube from "react-youtube";

import { getImageDimensions } from "@sanity/asset-utils";

import sanity, { imageBuilder } from "lib/sanity";

const SampleImageComponent = ({ value }) => {
  const { width, height } = getImageDimensions(value);
  return (
    <img
      src={urlBuilder().image(value).width(800).fit("max").auto("format").url()}
      alt={value.alt || " "}
      loading="lazy"
      style={{
        aspectRatio: width / height,
      }}
    />
  );
};

const Block = ({ value }) => (
  <PortableText
    components={{
      marks: {
        highlight: ({ children }) => (
          <chakra.pre display="inline" background="yellow.200" py={1} px={2}>
            {children}
          </chakra.pre>
        ),
      },
      types: {
        image: SampleImageComponent,
        youtube: ({ node }) => {
          const { url } = node;
          const id = getYouTubeId(url);
          return <YouTube className="responsive-video" videoId={id} />;
        },
        block: (props) => {
          const { style = "normal" } = props.node;
          switch (style) {
            case "normal":
              return (
                <Text my={4} fontWeight={300} fontSize={20}>
                  {props.children}
                </Text>
              );
            case "h1":
              return (
                <Heading fontSize="48" fontWeight="bold">
                  {props.children}
                </Heading>
              );
            case "h2":
              return (
                <Heading fontSize="35" fontWeight="bold">
                  {props.children}
                </Heading>
              );
            case "h3":
              return (
                <Heading fontSize="28" fontWeight="bold">
                  {props.children}
                </Heading>
              );
            case "h4":
              return (
                <Heading fontSize="18" fontWeight="bold">
                  {props.children}
                </Heading>
              );
            case "h5":
              return (
                <Heading fontSize="16" fontWeight="bold">
                  {props.children}
                </Heading>
              );
            case "h6":
              return (
                <Heading fontSize="14" fontWeight="bold">
                  {props.children}
                </Heading>
              );
          }

          const customBlocks = {
            blockquote: <chakra.blockquote>– {props.children}</chakra.blockquote>,
            body: {
              bg: mode("white", "gray.800"),
            },
          };

          return customBlocks[style] || BlockContent.defaultSerializers.types.block(props);
        },
      },
      list: (props) =>
        props.type === "bullet" ? (
          <chakra.ul>{props.children}</chakra.ul>
        ) : (
          <chakra.ol>{props.children}</chakra.ol>
        ),
      listItem: (props) => <chakra.li ml={12}>{props.children}</chakra.li>,
      image: (props) => (
        <figure>
          <Image
            src={imageBuilder(props.node.asset).width(768).url()}
            alt={props.node.alt || "missing alt text"}
          />
          <figcaption>
            <BlockContent blocks={props.node.caption} />
          </figcaption>
        </figure>
      ),
    }}
    value={value}
    {...sanity.config()}
  />
);

export default Block;
