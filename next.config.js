const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});
module.exports = withBundleAnalyzer({
  reactStrictMode: true,
  images: {
    domains: ["files.stripe.com", "cdn.sanity.io", "placekitten.com"],
  },
});
