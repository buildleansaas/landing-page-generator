import React from "react";
import { chakra } from "@chakra-ui/react";
import { PortableText } from "@portabletext/react";
import sanity from "lib/sanity";

const Block = ({ value, ...componentProps }) => {
  const sharedProps = { ...componentProps };
  const headerProps = { ...sharedProps, fontWeight: 500 };

  return (
    <PortableText
      components={{
        types: {
          youtube: ({ value }) => {
            const { url } = value;
            const id = getYouTubeId(url);
            return <YouTube className="responsive-video" videoId={id} />;
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
