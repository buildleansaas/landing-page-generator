import client from ".";
import groq from "groq";

const GET_PROJECT_CONFIG_QUERY = `
  *[_type == "projects" && domain == $domain][0]{
    "faviconURL": favicon.asset->url,
    ...
  }
`;

export const getProjectConfig = async (domain) =>
  await client.fetch(groq`${GET_PROJECT_CONFIG_QUERY}`, { domain });
