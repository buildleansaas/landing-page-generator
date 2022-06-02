export const getDomain = (req) =>
  req.headers.host.includes("localhost") ? process.env.TEST_DOMAIN : req.headers.host;
