import { serverQueryContent } from "#content/server";
import { asSitemapUrl, defineSitemapEventHandler } from "#imports";

export default defineSitemapEventHandler(async (e) => {
  const contentList = await serverQueryContent(e, "blogs").find();
  return contentList.map((c) => {
    return asSitemapUrl({
      loc: c._path,
      lastmod: new Date(c.date),
    });
  });
});
