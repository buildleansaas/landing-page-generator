/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["files.stripe.com", "cdn.sanity.io", "placekitten.com"],
  },
};

module.exports = nextConfig;
