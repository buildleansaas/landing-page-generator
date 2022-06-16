const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer({
  experimental: { runtime: "nodejs" },
  reactStrictMode: true,
  images: {
    domains: ["files.stripe.com", "cdn.sanity.io", "placekitten.com"],
  },
});
