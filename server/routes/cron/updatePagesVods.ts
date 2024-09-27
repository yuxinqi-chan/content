import { VodListResult, VodProvider } from "~/types/vod";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const token = query.token as string;
  const config = useRuntimeConfig(event);
  const appConfig = useAppConfig(event);
  const cronToken = config.cronToken;
  if (token !== cronToken) {
    return "Invalid token";
  }
  const success: string[] = [];
  const failed: string[] = [];
  await Promise.all(
    (appConfig.vodProviders as VodProvider[]).map(async (provider) => {
      try {
        // 获取上次分页
        const lastPage = Number(
          (await hubKV().get(`${provider.name}:lastPage`)) || 0,
        );
        if (lastPage >= 0) {
          const vodsPageResult = await $fetch<VodListResult>(provider.url, {
            query: {
              ac: "list",
              pg: lastPage + 1,
            },
            responseType: "json",
          });
          if (vodsPageResult.list.length > 0) {
            await useDrizzle()
              .insert(tables.vods)
              .values(
                vodsPageResult.list
                  .filter((vod) => vod.vod_id && vod.vod_name)
                  .map((vod) => ({
                    provider: provider.name,
                    vodId: vod.vod_id,
                    vodName: vod.vod_name,
                    vodRemarks: vod.vod_remarks,
                    vodTime: vod.vod_time,
                  })),
              )
              .onConflictDoUpdate({
                target: [tables.vods.provider, tables.vods.vodId],
                set: {
                  vodName: sql.raw(`excluded.${tables.vods.vodName.name}`),
                  vodRemarks: sql.raw(
                    `excluded.${tables.vods.vodRemarks.name}`,
                  ),
                  vodTime: sql.raw(`excluded.${tables.vods.vodTime.name}`),
                },
              });
            // 更新分页
            await hubKV().set(`${provider.name}:lastPage`, vodsPageResult.page);
          } else {
            // 没有更多数据
            await hubKV().set(`${provider.name}:lastPage`, -1);
          }
        }
        success.push(provider.label);
      } catch (error) {
        console.error(error);
        failed.push(provider.label);
      }
    }),
  );
  return { success, failed };
});