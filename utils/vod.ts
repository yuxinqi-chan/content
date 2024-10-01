export function urlsToList(urls: string) {
  const list = urls
    .split(/#|\$\$\$/)
    .filter(Boolean)
    .map((urlItem) => {
      const [label, url] = urlItem.split("$");
      return {
        label,
        url,
      };
    });
  return useUniqBy(list, (v) => v.label);
}
