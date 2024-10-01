import { z } from "zod";
import { VodProvider, VodVideoListResult } from "~/types/vod";
import { H3Event } from "h3";
import { like } from "drizzle-orm";
import { groupBy, entries } from "lodash-es";

export default cachedEventHandler(
  async (event) => {
    const { wd } = await getValidatedQuery(
      event,
      z.object({
        wd: z.string(),
      }).parse,
    );
    const appConfig = useAppConfig(event);
    const drizzle = useDrizzle();
    const vods = await drizzle
      .select()
      .from(tables.vods)
      .where(like(tables.vods.vodName, `${wd}%`));
    const vodMap = groupBy(vods, "provider");
    const result = await Promise.all(
      entries(vodMap).map(async ([providerName, vods]) => {
        const provider = (appConfig.vodProviders as VodProvider[]).find(
          (p) => p.name === providerName,
        )!;
        const videoList = await $fetch<VodVideoListResult>(provider.url, {
          query: {
            ac: "videolist",
            ids: vods.map((vod) => vod.vodId).join(","),
          },
          responseType: "json",
        });
        return { ...provider, list: videoList.list };
      }),
    );
    return result;
  },
  {
    maxAge: 60 * 60,
    getKey: (event: H3Event) => event.path,
  },
);
