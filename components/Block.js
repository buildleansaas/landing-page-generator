import React from "react";
import NextLink from "next/link";
import { chakra, Image, Link } from "@chakra-ui/react";
import { PortableText } from "@portabletext/react";
import sanity from "lib/sanity";
import ResponsiveEmbed from "react-responsive-embed";

const Block = ({ value, ...componentProps }) => {
  const sharedProps = { ...componentProps };
  const headerProps = { ...sharedProps, fontWeight: 500 };

  return (
    <PortableText
      components={{
        marks: {
          highlight: ({ children }) => (
            <chakra.span
              {...{ ...componentProps, backgroundColor: `#F3E779`, py: 1, px: 2, borderRadius: 2 }}
            >
              {children}
            </chakra.span>
          ),
          link: ({ children, value }) => (
            <Link color={`blue.500`} href={value.url} isExternal>
              {children}
            </Link>
          ),
          internalLink: ({ children, value }) => {
            const { slug = {} } = value;
            const href = `/${slug?.current}`;

            return (
              <NextLink href={href} isExternal>
                {children}
              </NextLink>
            );
          },
        },
        types: {
          youtube: ({ value }) => {
            const { url } = value;
            const id = getYouTubeId(url);
            return (
              <ResponsiveEmbed src={`https://www.youtube.com/embed/${id}?controls=0`} allowFullScreen />
            );
          },
          image: ({ value }) => (
            <figure>
              <Image
                src={imageBuilder(value.asset).width(768).url()}
                alt={value.alt || "missing alt text"}
              />
              <figcaption>
                <Block value={value.caption} />
              </figcaption>
            </figure>
          ),
        },
        block: {
          normal: ({ children }) => (
            <chakra.p my={4} fontWeight={300} fontSize={20} {...componentProps}>
              {children}
            </chakra.p>
          ),
          h1: ({ children }) => (
            <chakra.h1 fontSize="48" {...headerProps}>
              {children},
            </chakra.h1>
          ),
          h2: ({ children }) => (
            <chakra.h2 fontSize="35" {...headerProps}>
              {children}
            </chakra.h2>
          ),
          h3: ({ children }) => (
            <chakra.h3 fontSize="28" {...headerProps}>
              {children}
            </chakra.h3>
          ),
          h4: ({ children }) => (
            <chakra.h4 fontSize="18" {...headerProps}>
              {children}
            </chakra.h4>
          ),
          h5: ({ children }) => (
            <chakra.h5 fontSize="16" {...headerProps}>
              {children}
            </chakra.h5>
          ),
          h6: ({ children }) => (
            <chakra.h6 fontSize="14" {...headerProps}>
              {children}
            </chakra.h6>
          ),
          blockquote: ({ children }) => (
            <chakra.blockquote {...componentProps}>{children}</chakra.blockquote>
          ),
        },
        list: {
          number: ({ children }) => <chakra.ol {...componentProps}>{children}</chakra.ol>,
          bullet: ({ children }) => <chakra.ul {...componentProps}>{children}</chakra.ul>,
        },
        listItem: {
          bullet: ({ children }) => (
            <chakra.li ml={12} {...componentProps}>
              {children}
            </chakra.li>
          ),
          number: ({ children }) => (
            <chakra.li ml={12} {...componentProps}>
              {children}
            </chakra.li>
          ),
        },
      }}
      value={value}
      imageOptions={{ w: 754, fit: "max" }}
      {...sanity.config()}
    />
  );
};

export default Block;
