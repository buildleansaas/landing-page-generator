import NextAuth from "next-auth";

// providers

import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

import { PrismaAdapter } from "@next-auth/prisma-adapter";

import { getProjectConfig } from "lib/sanity/config";
import { imageBuilder } from "lib/sanity";
import prisma from "lib/api/prisma";
import { getDomain } from "utils";

const supportedProvidersMap = {
  github: GithubProvider,
  google: GoogleProvider,
};

export default async function auth(req, res) {
  const siteConfig = await getProjectConfig(await getDomain(req));

  let providers = [];

  Object.entries(supportedProvidersMap).forEach(([key, value]) => {
    const { oauthEnabled, clientId, clientSecret } = siteConfig?.[key] ?? {};

    if (!!clientId && !!clientSecret && oauthEnabled) {
      providers = [...providers, value({ clientId, clientSecret, checks: "both" })];
    }
  });

  // TODO: enable only specific login methods

  return await NextAuth(req, res, {
    adapter: PrismaAdapter(prisma),
    providers,
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
      async redirect({ url, baseUrl }) {
        // Allows relative callback URLs
        if (url.startsWith("/")) return `${baseUrl}${url}`;
        // Allows callback URLs on the same origin
        else if (new URL(url).origin === baseUrl) return url;
        return baseUrl;
      },
    },
    theme: {
      colorScheme: "auto",
      logo: imageBuilder(siteConfig.productInfo.sharedProductLogo).width(250).url(),
    },
    debug: true,
  });
}
