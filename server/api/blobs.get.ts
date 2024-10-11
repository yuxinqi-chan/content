import { z } from "zod";

export default defineEventHandler(async (event) => {
  const { limit = 10, prefix } = await getValidatedQuery(
    event,
    z.object({
      limit: z.coerce.number().min(1).max(100),
      prefix: z.string(),
    }).parse,
  );

  const { blobs } = await hubBlob().list({ limit, prefix });

  return blobs;
});
