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
  const success = [];
  const failed = [];
  for (const provider of appConfig.vodProviders as VodProvider[]) {
    try {
      const vods = await $fetch<VodListResult>(provider.url, {
        query: {
          ac: "list",
          h: 4,
        },
        responseType: "json",
      });
      for (const vod of vods.list) {
        await useDrizzle()
          .insert(tables.vods)
          .values({
            provider: provider.name,
            vodId: vod.vod_id,
            vodName: vod.vod_name,
            vodRemarks: vod.vod_remarks,
            vodTime: vod.vod_time,
          })
          .onConflictDoUpdate({
            target: [tables.vods.provider, tables.vods.vodId],
            set: {
              vodName: vod.vod_name,
              vodRemarks: vod.vod_remarks,
              vodTime: vod.vod_time,
            },
          });
      }
      success.push(provider.label);
    } catch (error) {
      console.error(error);
      failed.push(provider.label);
    }
  }
  return { success, failed };
});
