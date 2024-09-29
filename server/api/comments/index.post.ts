import { z } from "zod";

export default defineEventHandler(async (event) => {
  const { replyTo, nickname, email, avatar, site, content } =
    await readValidatedBody(
      event,
      z.object({
        replyTo: z.string(),
        nickname: z.string(),
        email: z.string(),
        avatar: z.string().optional(),
        site: z.string().optional(),
        content: z.string(),
      }).parse,
    );
  const drizzle = useDrizzle();
  const cf = event.context.cf as CfProperties;
  const location = cf.city || cf.region || cf.country || cf.continent;
  const userAgent = getHeader(event, "user-agent");
  const ip = getRequestIP(event, { xForwardedFor: true });
  await drizzle.insert(tables.comments).values({
    replyTo,
    nickname,
    email,
    site,
    content,
    ip,
    avatar,
    location: String(location),
    userAgent,
  });
  setResponseStatus(event, 201);
});
