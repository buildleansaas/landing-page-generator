const Robots = () => {
  return <></>;
};

export const getServerSideProps = async ({ req, res }) => {
  res.setHeader("Content-Type", "text/plain");
  res.write(`User-agent: *
Allow:
Sitemap: ${req.headers.host}/sitemap.xml
  `);
  res.end();
  return {};
};

export default Robots;
