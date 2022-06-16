import { getProjectDomains } from "lib/sanity/config";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

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

export const formatDate = (date) =>
  MONTHS[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();

export function isEmpty(obj) {
  return Object.prototype.toString.call(obj) === "[object Object]" && JSON.stringify(obj) === "{}";
}

export const stripeCustomerEnvIdKey =
  process.env.NODE_ENV === "development" ? "stripeTestCustomerId" : "stripeCustomerId";

export const getUserStripeId = (user) => user[stripeCustomerEnvIdKey];
