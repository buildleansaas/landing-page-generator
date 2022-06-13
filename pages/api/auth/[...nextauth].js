import NextAuth from "next-auth";

// providers

import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

import { PrismaAdapter } from "@next-auth/prisma-adapter";

import { getProjectConfig } from "lib/sanity/config";
import { imageBuilder } from "lib/sanity";
import prisma from "lib/api/prisma";
import { getDomain } from "utils";

const providersMap = {
  github: GithubProvider,
  google: GoogleProvider,
};

export default async function auth(req, res) {
  const siteConfig = await getProjectConfig(await getDomain(req));

  let providers = [];

  Object.entries(providersMap).forEach(([key, value]) => {
    console.log(siteConfig?.[key]);
    const { oauthEnabled, clientId, clientSecret } = siteConfig?.[key] ?? {};

    if (!!clientId && !!clientSecret && oauthEnabled) {
      providers = [...providers, value({ clientId, clientSecret })];
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
      async jwt({ token, account }) {
        // Persist the OAuth access_token to the token right after signin
        if (account) {
          token.accessToken = account.access_token;
        }
        return token;
      },
      async session({ session, token, user }) {
        // Send properties to the client, like an access_token from a provider.
        session.accessToken = token.accessToken;
        return session;
      },
    },
    theme: {
      colorScheme: "auto",
      logo: imageBuilder(siteConfig.productInfo.sharedProductLogo).width(250).url(),
    },
  });
}
