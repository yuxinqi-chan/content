import { H3Event } from "h3";

export default cachedEventHandler(
  async (event) => {
    const path = event.context.params?.path;
    if (!path) {
      throw createError({ statusCode: 400, statusMessage: "Bad Request" });
    }
    const appConfig = useRuntimeConfig(event);
    const url = `https://api.themoviedb.org/3/${path}`;
    const query = getQuery(event);
    const response = await $fetch(url, {
      method: event.method,
      query: query,
      body: event.method === "GET" ? null : await readBody(event),
      headers: {
        Authorization: `Bearer ${appConfig.tmdbAccessToken}`,
      },
    });
    return response;
  },
  {
    maxAge: 60 * 60,
    getKey: (event: H3Event) => event.path,
  },
);
