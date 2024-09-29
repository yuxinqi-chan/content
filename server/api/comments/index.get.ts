import { countDistinct, desc } from "drizzle-orm";
import { z } from "zod";

export default defineEventHandler(async (event) => {
  const { replyTo, page, pageSize } = await getValidatedQuery(
    event,
    z.object({
      replyTo: z.string().optional(),
      page: z.number({ coerce: true }).default(1),
      pageSize: z.number({ coerce: true }).default(10),
    }).parse,
  );
  const drizzle = useDrizzle();
  if (replyTo) {
    const comments = await drizzle
      .select()
      .from(tables.comments)
      .where(eq(tables.comments.replyTo, replyTo))
      .limit(pageSize)
      .offset((page - 1) * pageSize);
    const total = await drizzle
      .select({ count: countDistinct(tables.comments.id) })
      .from(tables.comments)
      .where(eq(tables.comments.replyTo, replyTo));
    return {
      page,
      pageSize,
      total: total[0].count,
      totalPages: Math.ceil(total[0].count / pageSize),
      list: comments,
    };
  }
  const comments = await drizzle
    .select()
    .from(tables.comments)
    .orderBy(desc(tables.comments.createdAt))
    .limit(pageSize)
    .offset((page - 1) * pageSize);
  const total = await drizzle
    .select({ count: countDistinct(tables.comments.id) })
    .from(tables.comments);
  return {
    page,
    pageSize,
    total: total[0].count,
    totalPages: Math.ceil(total[0].count / pageSize),
    list: comments,
  };
});
