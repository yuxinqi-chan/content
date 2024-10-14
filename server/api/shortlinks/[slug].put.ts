import { z } from "zod";

export default defineEventHandler(async (event) => {
  const { slug } = await getValidatedRouterParams(
    event,
    z.object({
      slug: z.string(),
    }).parse,
  );
  const { url, isProxy } = await readValidatedBody(
    event,
    z.object({
      url: z.string().url(),
      isProxy: z.boolean().default(false),
    }).parse,
  );
  const db = useDrizzle();
  const shortLink = await db
    .insert(tables.shortLinks)
    .values({
      url: url,
      slug: slug,
      isProxy: isProxy,
    })
    .onConflictDoUpdate({
      target: tables.shortLinks.slug,
      set: {
        url: url,
        isProxy: isProxy,
      },
    })
    .returning();
  return shortLink[0];
});
