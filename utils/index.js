import { getProjectDomains } from "lib/sanity/config";

export const getDomain = async (req) => {
  const domains = await getProjectDomains();

  if (!domains.includes(req.headers.host) || req.headers.host.includes("localhost")) {
    return process.env.TEST_DOMAIN;
  } else {
    return req.headers.host.replace("https://", "").replace("http://", "").replace("www.", "");
  }
};

export const isEmpty = (value) => {
  return (
    value == null || // From standard.js: Always use === - but obj == null is allowed to check null || undefined
    (typeof value === "object" && Object.keys(value).length === 0) ||
    (typeof value === "string" && value.trim().length === 0)
  );
};
