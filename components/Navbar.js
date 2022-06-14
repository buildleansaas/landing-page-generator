import * as React from "react";
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  IconButton,
  Image,
  Text,
  useBreakpointValue,
  useDisclosure,
  VStack,
  Divider,
} from "@chakra-ui/react";
import { isEmpty } from "lodash";
import NextLink from "next/link";
import { FiMenu } from "react-icons/fi";
import { signIn, signOut } from "next-auth/react";

import { imageBuilder } from "lib/sanity";

import Dialog from "components/Dialog";
import Footer from "components/Footer";

const AppHeader = ({ onClose, sharedProductLogo, sharedProductName, sharedProductSlogan, isDesktop }) => {
  return (
    <NextLink href="/" passHref>
      <Box display="flex" alignItems="center" justifyContent="flex-start" onClick={onClose}>
        <Image
          {...{
            src: imageBuilder(sharedProductLogo).height(500).width(500).url(),
            height: isDesktop ? 20 : 12,
            alt: "",
          }}
        />
        <Box
          display={{ base: "flex" }}
          flexDir="column"
          alignItems={{ base: "flex-start" }}
          justifyContent={{ base: "center" }}
          ml={{ base: 2 }}
          mt={{ base: 0 }}
          onClick={onClose}
        >
          <Text fontSize={{ base: 20, md: 24 }} letterSpacing="tight" color="black" fontWeight={700}>
            {sharedProductName}
          </Text>
          <Text
            mt={{ base: 0, lg: -1.5 }}
            fontSize={{ base: 12, md: 14 }}
            fontWeight={300}
            letterSpacing="tight"
            color="black"
          >
            {sharedProductSlogan}
          </Text>
        </Box>
      </Box>
    </NextLink>
  );
};

const NavButton = ({ id, onClose, name, href, label, icon, sharedProductLogo, ...rest }) => (
  <NextLink href={href} passHref>
    <Button
      {...{
        onClick: onClose,
        leftIcon: <>{icon}</>,
        size: "sm",
        ...rest,
        ...(["app", "learn"].includes(id) || id === name
          ? {
              colorScheme: "blue",
            }
          : {
              colorScheme: "whiteAlpha",
              color: "black",
            }),
      }}
    >
      {label}
    </Button>
  </NextLink>
);

export default function Navbar({
  id,
  user,
  colorScheme,
  companyName,
  companyLink,
  socialLinks,
  community,
  sharedProductName,
  sharedProductLogo,
  sharedProductSlogan,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const isDesktop = useBreakpointValue({ base: false, lg: true });
  const padding = useBreakpointValue({ base: 2, md: 4, lg: 6 });

  const appHeaderProps = {
    id,
    sharedProductLogo,
    sharedProductName,
    sharedProductSlogan,
    onClose,
    isDesktop,
  };

  const navLinks = () =>
    [
      !isEmpty(user) && {
        name: "chat",
        href: community,
        label: "Community",
        icon: "🫂",
        target: "_blank",
        rel: "noopener",
      },
    ]
      .filter(Boolean)
      ?.map((props) => <NavButton key={props.href} {...{ ...props, onClose }} />);

  return (
    <Flex
      display="flex"
      alignItems="flex-start"
      justifyContent="space-between"
      width="100%"
      px={padding}
      pt={padding}
    >
      <AppHeader {...appHeaderProps} />
      {isDesktop ? (
        <VStack align="end">
          <HStack pr={2} mb={3}>
            <ButtonGroup spacing="1" ml="auto" mr={2}>
              {navLinks()}
            </ButtonGroup>
            {!isEmpty(user) ? (
              <IconButton
                icon={<Avatar fontSize={8} boxSize="8" name={user.name} src={user.image} />}
                onClick={signOut}
                variant="ghost"
              />
            ) : (
              <Button
                size="sm"
                aria-label="Signup"
                variant="ghost"
                leftIcon={<>👋</>}
                onClick={() => signIn()}
              >
                Signup
              </Button>
            )}
          </HStack>
        </VStack>
      ) : (
        <IconButton
          variant="ghost"
          icon={<FiMenu fontSize="1.33rem" />}
          aria-label="Open Menu"
          onClick={onOpen}
        />
      )}

      {!isDesktop && (
        <Dialog
          {...{
            title: <AppHeader {...appHeaderProps} />,
            onClose,
            isOpen,
            onSave: false,
            children: (
              <VStack
                spacing={4}
                height="100%"
                width="100%"
                flexDir="column"
                align="center"
                justify="center"
              >
                <VStack spacing={3} width="100%">
                  {navLinks()}
                </VStack>
                <Divider my={2} />
                <Footer {...{ companyName, socialLinks, companyLink, colorScheme }} />
              </VStack>
            ),
          }}
        />
      )}
    </Flex>
  );
}
