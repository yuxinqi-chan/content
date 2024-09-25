<script lang="ts" setup>
import type { TmdbTvTrendingResult, TmdbPageResult } from "~/types/tmdb";

const { t, locale } = useI18n();
useHead({
  title: t("Tv"),
});
const { data } = await useFetch<TmdbPageResult<TmdbTvTrendingResult>>(
  "/api/tmdb/trending/tv/week",
  {
    method: "GET",
    query: {
      language: locale.value,
    },
  },
);
const getTitle = (item: TmdbTvTrendingResult) => {
  return item.name || item.original_name;
};
</script>
<template>
  <div
    class="mx-auto grid w-full max-w-[1500px] grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4 py-8"
  >
    <UCard
      v-for="item in data?.results"
      :key="item.id"
      class="max-w-[180px] overflow-hidden"
      :ui="{
        header: {
          padding: 'sm:px-0 p-0',
        },
      }"
    >
      <template #header>
        <NuxtLink :to="`/tv/${item.id}`">
          <img
            :src="`https://image.tmdb.org/t/p/w220_and_h330_face${item.poster_path}`"
            width="180"
            height="270"
          />
        </NuxtLink>
      </template>
      <NuxtLink :to="`/tv/${item.id}`" class="link line-clamp-1">
        {{ getTitle(item) }}
      </NuxtLink>
    </UCard>
  </div>
</template>
