<script lang="ts" setup>
import type { TmdbTvDetail } from "~/types/tmdb";

definePageMeta({
  layout: "player",
});
const { t } = useI18n();
const route = useRoute();
const { locale } = useI18n();
const { data } = await useFetch<TmdbTvDetail>(
  `/api/tmdb/tv/${route.params.id}`,
  {
    query: {
      language: locale.value,
    },
  },
);
if (!data.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Not Found",
  });
}
const title = computed(
  () =>
    data.value?.name || data.value?.original_name || String(route.params.id),
);
useHead({
  title: title.value,
});

const breadcrumbLinks = [
  {
    label: t("Home"),
    icon: "i-heroicons-home",
    to: "/",
  },
  {
    label: t("Tv"),
    icon: "i-heroicons-tv",
    to: "/tv",
  },
  {
    label: title.value,
    icon: "i-heroicons-link",
  },
];
</script>
<template>
  <div>
    <div class="mx-auto max-w-[1400px] px-[40px] py-2">
      <UBreadcrumb :links="breadcrumbLinks" />
    </div>
    <div v-if="data" class="flex flex-col gap-4">
      <TmdbHeader :data="data" />
    </div>
  </div>
</template>
