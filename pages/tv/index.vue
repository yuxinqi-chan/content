<script lang="ts" setup>
import type { TmdbTvTrendingResult, TmdbPageResult } from "~/types/tmdb";

const { t, locale } = useI18n();
const router = useRouter();
const route = useRoute();
useHead({
  title: t("Tv"),
});
const search = ref(route.query.search as string);
const dataUrl = computed(() =>
  route.query.search ? "/api/tmdb/search/tv" : "/api/tmdb/trending/tv/week",
);
const pageNumber = useRouteQuery("page", 1, { transform: Number });
const searchQuery = computed(() =>
  route.query.search
    ? {
        query: route.query.search,
        language: locale.value,
        page: route.query.page,
      }
    : {
        language: locale.value,
        page: route.query.page,
      },
);
const { data } = await useFetch<TmdbPageResult<TmdbTvTrendingResult>>(dataUrl, {
  method: "GET",
  query: searchQuery,
});
const getTitle = (item: TmdbTvTrendingResult) => {
  return item.name || item.original_name;
};
const searchTv = () => {
  router.push({
    query: {
      search: search.value,
    },
  });
};
</script>
<template>
  <UContainer class="container flex flex-grow flex-col gap-4 py-8">
    <UInput
      icon="i-heroicons-magnifying-glass-20-solid"
      size="sm"
      color="white"
      :trailing="false"
      :placeholder="t('Search')"
      v-model="search"
      @keyup.enter="searchTv"
    />
    <ul class="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4 py-8">
      <UCard
        v-for="item in data?.results"
        as="li"
        :key="item.id"
        class="overflow-hidden"
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
              width="100%"
              class="aspect-[2/3] object-cover"
            />
          </NuxtLink>
        </template>
        <NuxtLink
          :to="`/tv/${item.id}`"
          class="link line-clamp-1"
          :title="getTitle(item)"
        >
          {{ getTitle(item) }}
        </NuxtLink>
      </UCard>
    </ul>
    <UPagination
      v-if="data && data.total_pages > 1"
      class="mx-auto"
      v-model="pageNumber"
      :page-count="20"
      :total="data.total_results"
    />
  </UContainer>
</template>
