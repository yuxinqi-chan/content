<script lang="ts" setup>
import type { ParsedContent } from "@nuxt/content";

const config = useRuntimeConfig();
const { t, locale } = useI18n();
useHead({
  titleTemplate: (title) =>
    title ? `${title} - ${config.app.name}` : config.app.name,
});

const { data: navigation } = await useAsyncData(
  "navigation",
  () => fetchContentNavigation(),
  {
    default: () => [],
  },
);
const { data: files } = useLazyFetch<ParsedContent[]>("/api/search.json", {
  default: () => [],
  server: false,
});

const links = [
  {
    label: t("Movies"),
    to: "/movies",
    icon: "i-mdi-movie",
  },
  {
    label: t("Tv"),
    to: "/tv",
    icon: "i-mdi-television",
  },
  {
    label: t("Tools"),
    children: [
      {
        label: t("id-photo-generator"),
        icon: "i-mdi-camera",
        target: "_blank",
        to: "https://idphotos.compilesoul.com",
      },
      {
        label: t("pdf-converter"),
        icon: "i-mdi-file-pdf",
        target: "_blank",
        to: locale.value.includes("zh")
          ? "https://pdf.compilesoul.com/?lang=zh_CN"
          : "https://pdf.compilesoul.com",
      },
      {
        label: t("web-ssh"),
        icon: "i-mdi-terminal",
        target: "_blank",
        to: "https://sshwifty.compilesoul.com",
      },
    ],
  },
];
</script>

<template>
  <div>
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtRouteAnnouncer />
      <NuxtPage />
    </NuxtLayout>
    <ClientOnly>
      <LazyContentSearch
        :files="files"
        :navigation="navigation"
        :links="links"
      />
    </ClientOnly>
    <UNotifications />
  </div>
</template>
<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
