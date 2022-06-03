export async function getDomain(req) {
  return req.headers.host.includes("localhost") ? process.env.TEST_DOMAIN : req.headers.host;
}
