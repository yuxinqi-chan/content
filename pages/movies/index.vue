<script lang="ts" setup>
import type { TmdbMovieTrendingResult, TmdbPageResult } from "~/types/tmdb";

const { t, locale } = useI18n();
const router = useRouter();
const route = useRoute();
useHead({
  title: t("Movies"),
});
const search = ref(route.query.search as string);
const dataUrl = computed(() =>
  route.query.search
    ? "/api/tmdb/search/movie"
    : "/api/tmdb/trending/movie/week",
);
const searchQuery = computed(() =>
  route.query.search
    ? {
        query: route.query.search,
        language: locale.value,
      }
    : {
        language: locale.value,
      },
);
const { data } = await useFetch<TmdbPageResult<TmdbMovieTrendingResult>>(
  dataUrl,
  {
    method: "GET",
    query: searchQuery,
  },
);
const getTitle = (item: TmdbMovieTrendingResult) => {
  return item.title || item.original_title;
};
const searchMovie = () => {
  router.push({
    query: {
      search: search.value,
    },
  });
};
</script>
<template>
  <div class="mx-auto flex w-full max-w-[1500px] flex-col gap-4">
    <UInput
      icon="i-heroicons-magnifying-glass-20-solid"
      size="sm"
      color="white"
      :trailing="false"
      :placeholder="t('Search')"
      v-model="search"
      @keyup.enter="searchMovie"
    />
    <div
      class="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4 py-8"
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
          <NuxtLink :to="`/movies/${item.id}`">
            <img
              :src="`https://image.tmdb.org/t/p/w220_and_h330_face${item.poster_path}`"
              width="180"
              height="270"
            />
          </NuxtLink>
        </template>
        <NuxtLink
          :to="`/movies/${item.id}`"
          class="link line-clamp-1"
          :title="getTitle(item)"
        >
          {{ getTitle(item) }}
        </NuxtLink>
      </UCard>
    </div>
  </div>
</template>
