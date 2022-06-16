import client from ".";
import groq from "groq";

const GET_PROJECT_CONFIG_QUERY = `
  *[_type == "projects" && domain == $domain][0]{
    ...,
    body[]{
      ...,
      markDefs[]{
        ...,
        _type == "internalLink" => {
          "slug": @.reference->slug
        }
      }
    }
  }
`;

export const getProjectConfig = async (domain) =>
  await client.fetch(groq`${GET_PROJECT_CONFIG_QUERY}`, { domain });

export const getProjectDomains = async () => await client.fetch(groq`*[_type == "projects"].domain`);
