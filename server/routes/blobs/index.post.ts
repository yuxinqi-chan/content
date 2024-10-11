export default defineEventHandler(async (event) => {
  const form = await readFormData(event);
  const file = form.get("file") as File;

  if (!file || !file.size) {
    throw createError({ statusCode: 400, message: "No file provided" });
  }

  ensureBlob(file, {
    maxSize: "8MB",
    types: ["image"],
  });

  const prefix = form.get("prefix") as string;
  if (!prefix) {
    throw createError({ statusCode: 400, message: "No prefix provided" });
  }

  return hubBlob().put(file.name, file, {
    addRandomSuffix: true,
    prefix,
  });
});
