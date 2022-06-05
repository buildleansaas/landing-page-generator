import { getProjectDomains } from "lib/sanity/config";
import { MONTHS } from "constants";

// TODO: hacky rewrite this please.
const trimHost = (host) => {
  let finalHost = host;
  finalHost = host.replace("https://", "");
  finalHost = host.replace("https://www.", "");
  finalHost = host.replace("http://www.", "");
  finalHost = host.replace("http://", "");
  finalHost = host.replace("www.", "");
  return finalHost;
};

export const getDomain = async (req) => {
  const domains = await getProjectDomains();
  const host = trimHost(req.headers.host);

  if (!domains.includes(host) || host.includes("localhost")) {
    return process.env.TEST_DOMAIN;
  } else {
    return trimHost(req.headers.host);
  }
};

export const isEmpty = (value) => {
  return (
    value == null || // From standard.js: Always use === - but obj == null is allowed to check null || undefined
    (typeof value === "object" && Object.keys(value).length === 0) ||
    (typeof value === "string" && value.trim().length === 0)
  );
};

export const formatDate = (date) =>
  MONTHS[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
