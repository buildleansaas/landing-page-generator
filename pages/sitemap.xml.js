const Sitemap = () => {
  return <></>;
};

export const getServerSideProps = async ({ req, res }) => {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

  const routes = [
    {
      path: `/`,
      changefreq: "daily",
      priority: 1,
    },
  ];

  // const Posts = await sanity.fetch(`
  //     *[_type == 'post']{
  //       slug,
  //     }`);

  // for (let i = 0; i < Posts.length; i += 1) {
  //   const item = Posts[i];
  //   routes.push({
  //     url: `blog-post/${item.slug.current}`,
  //     changefreq: "daily",
  //     priority: 1,
  //   });
  // }

  routes.map(({ path, changefreq, priority }) => {
    xml += "<url>";
    xml += `<loc>https://${req.headers.host}/${path}</loc>`;
    xml += `<changefreq>${changefreq}</changefreq>`;
    xml += `<priority>${priority}</priority>`;
    xml += "</url>";
  });

  xml += "</urlset>";

  res.setHeader("Content-Type", "text/xml");
  res.write(xml);
  res.end();
  return {};
};

export default Sitemap;
