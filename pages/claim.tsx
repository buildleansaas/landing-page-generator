import { getProjectConfig } from "lib/sanity/config";
import { getDomain } from "utils";

export async function getServerSideProps({ req }) {
  const config = await getProjectConfig(await getDomain(req));
  if (config.rewardLink) {
    return {
      redirect: {
        permanent: false,
        destination: config.rewardLink,
      },
    };
  } else {
    return { ...config };
  }
}

function Claim({ ...config }) {
  return <p>Rewrite a custom Claims page here!</p>;
}

export default Claim;
