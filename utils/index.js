import { getProjectDomains } from "lib/sanity/config";

export const getDomain = async (req) => {
  const domains = await getProjectDomains();

  if (!domains.includes(req.headers.host) || req.headers.host.includes("localhost")) {
    return process.env.TEST_DOMAIN;
  } else {
    return req.headers.host.replace("https://", "").replace("http://", "").replace("www.", "");
  }
};
