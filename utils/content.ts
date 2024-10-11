import type { NavItem, ParsedContent } from "@nuxt/content";

export function findPageBreadcrumb(
  navigation?: NavItem[],
  page?: ParsedContent | undefined | null,
): NavItem[] {
  if (!navigation || !page) {
    return [];
  }

  return navigation.reduce((breadcrumb: NavItem[], link: NavItem) => {
    if (page._path && (page._path + "/").startsWith(link._path + "/")) {
      if (link.children) {
        breadcrumb.push(link);
        breadcrumb.push(...findPageBreadcrumb(link.children, page));
      }
    }
    return breadcrumb;
  }, []);
}
