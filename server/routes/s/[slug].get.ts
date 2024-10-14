import { z } from "zod";

export default defineEventHandler(async (event) => {
  const { slug } = await getValidatedRouterParams(
    event,
    z.object({
      slug: z.string(),
    }).parse,
  );
  const db = useDrizzle();
  const shortLink = await db
    .select()
    .from(tables.shortLinks)
    .where(eq(tables.shortLinks.slug, slug))
    .then(selectOne);

  if (!shortLink) {
    throw createError({
      statusCode: 404,
      statusMessage: "Short link not found",
    });
  }

  if (shortLink.isProxy) {
    return fetch(shortLink.url);
  } else {
    sendRedirect(event, shortLink.url, 302);
  }
});
