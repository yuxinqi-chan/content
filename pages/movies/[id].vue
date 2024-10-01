<script lang="ts" setup>
import type { TmdbMovieDetail } from "~/types/tmdb";
import type { VodVideoItem } from "~/types/vod";
import { VideoPlayer } from "@videojs-player/vue";
import "video.js/dist/video-js.css";

definePageMeta({
  layout: "player",
});
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const { locale } = useI18n();
const { data: tmdbData } = await useFetch<TmdbMovieDetail>(
  `/api/tmdb/movie/${route.params.id}`,
  {
    query: {
      language: locale.value,
    },
  },
);
if (!tmdbData.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Not Found",
  });
}
const title = computed(
  () =>
    tmdbData.value?.title ||
    tmdbData.value?.original_title ||
    String(route.params.id),
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
    label: t("Movies"),
    icon: "i-heroicons-film",
    to: "/movies",
  },
  {
    label: title.value,
    icon: "i-heroicons-link",
  },
];
const videoPlayerRef = ref();
type PlayingVideo = {
  provider: string;
  vod_id: number;
  label: string;
  url: string;
  vod_name: string;
  poster: string;
};
const playingVideo = ref<PlayingVideo>();
const { data: providers } = await useFetch("/api/vodprovide", {
  query: {
    wd: title.value,
  },
});
const notEmptyProviders = providers.value?.filter((p) => p.list.length > 0);
const defaultOpenProvider = notEmptyProviders?.find(
  (p) => p.label === route.query.provider,
);
if (defaultOpenProvider) {
  (defaultOpenProvider as any).defaultOpen = true;
  const defaultOpenVod = defaultOpenProvider.list.find(
    (vod) => vod.vod_id === Number(route.query.vod_id),
  );
  if (defaultOpenVod) {
    (defaultOpenVod as any).defaultOpen = true;
    const defaultOpenVideo = urlsToList(defaultOpenVod.vod_play_url).find(
      (v) => v.label === route.query.label,
    );
    if (defaultOpenVideo) {
      playingVideo.value = {
        provider: defaultOpenProvider.label,
        vod_id: defaultOpenVod.vod_id,
        label: defaultOpenVideo.label,
        url: defaultOpenVideo.url,
        vod_name: defaultOpenVod.vod_name,
        poster: defaultOpenVod.vod_pic,
      };
    }
  } else {
    (defaultOpenProvider.list?.[0] as any).defaultOpen = true;
  }
} else {
  if (notEmptyProviders?.[0]) {
    (notEmptyProviders[0] as any).defaultOpen = true;
    for (const notEmptyProvider of notEmptyProviders) {
      if (notEmptyProvider.list?.[0]) {
        (notEmptyProvider.list[0] as any).defaultOpen = true;
      }
    }
  }
}
defineShortcuts({
  " ": () => {
    if (videoPlayerRef.value) {
      const player = videoPlayerRef.value;
      if (player.paused()) {
        player.play();
      } else {
        player.pause();
      }
    }
  },
});
function playVideo(source: PlayingVideo) {
  playingVideo.value = source;
  router.push({
    query: {
      provider: source.provider,
      vod_id: source.vod_id,
      label: source.label,
    },
  });
  const player = document.getElementById("player");
  if (player) {
    // scroll player to middle of the page
    player.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }
}
</script>
<template>
  <div>
    <div class="mx-auto max-w-[1400px] px-[40px] py-2">
      <UBreadcrumb :links="breadcrumbLinks" />
    </div>
    <div v-if="tmdbData" class="flex flex-col gap-4">
      <TmdbHeader :data="tmdbData" />
    </div>
    <div
      class="mx-auto flex max-w-[1400px] flex-col gap-4 px-[40px] py-2"
      v-if="notEmptyProviders"
    >
      <div v-if="playingVideo" class="text-xl font-bold">
        {{ `${playingVideo.vod_name}: ${playingVideo.label}` }}
      </div>
      <ClientOnly v-if="playingVideo">
        <video-player
          id="player"
          :src="playingVideo.url"
          :poster="`https://media.themoviedb.org/t/p/w1920_and_h800_multi_faces/${tmdbData?.backdrop_path}`"
          autoplay
          controls
          fluid
          @mounted="({ player }) => (videoPlayerRef = player)"
        />
      </ClientOnly>
      <div>
        <UAccordion :items="notEmptyProviders">
          <template #default="{ item, index, open }">
            <UButton
              color="gray"
              variant="ghost"
              class="border-b border-gray-200 dark:border-gray-700"
              :ui="{ rounded: 'rounded-none', padding: { sm: 'p-3' } }"
            >
              <span class="truncate">{{ item.label }}</span>
              <UBadge size="xs" color="gray" variant="solid">
                {{ item.list.length }}
              </UBadge>
              <template #trailing>
                <UIcon
                  name="i-heroicons-chevron-right-20-solid"
                  class="ms-auto h-5 w-5 transform transition-transform duration-200"
                  :class="[open && 'rotate-90']"
                />
              </template>
            </UButton>
          </template>
          <template #item="{ item: provider }">
            <UAccordion
              :items="
                provider.list.map((o: VodVideoItem) => ({
                  ...o,
                  label: o.vod_name,
                }))
              "
              class="px-4"
            >
              <template #default="{ item, index, open }">
                <UButton
                  color="gray"
                  variant="ghost"
                  class="border-b border-gray-200 dark:border-gray-700"
                  :ui="{ rounded: 'rounded-none', padding: { sm: 'p-3' } }"
                >
                  <span class="truncate">{{ item.label }}</span>
                  <UButton
                    icon="i-heroicons-arrow-top-right-on-square"
                    size="sm"
                    variant="ghost"
                    color="gray"
                    square
                    :to="item.site"
                    target="_blank"
                  />
                  <UBadge
                    size="xs"
                    color="gray"
                    variant="solid"
                    v-if="item.vod_remarks"
                  >
                    <span class="mr-1">{{
                      $dayjs(item.vod_time).fromNow()
                    }}</span>
                    <span>{{ item.vod_remarks }}</span>
                  </UBadge>
                  <template #trailing>
                    <UIcon
                      name="i-heroicons-chevron-right-20-solid"
                      class="ms-auto h-5 w-5 transform transition-transform duration-200"
                      :class="[open && 'rotate-90']"
                    />
                  </template>
                </UButton>
              </template>
              <template #item="{ item: vod }: { item: VodVideoItem }">
                <div
                  class="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-2 px-4"
                >
                  <UButton
                    v-for="source in urlsToList(vod.vod_play_url)"
                    class="justify-center"
                    color="blue"
                    :key="source.label"
                    :variant="
                      source.label === playingVideo?.label &&
                      provider.label === playingVideo?.provider &&
                      vod.vod_id === playingVideo?.vod_id
                        ? 'solid'
                        : 'outline'
                    "
                    :disabled="
                      source.label === playingVideo?.label &&
                      provider.label === playingVideo?.provider &&
                      vod.vod_id === playingVideo?.vod_id
                    "
                    @click="
                      playVideo({
                        provider: provider.label,
                        vod_id: vod.vod_id,
                        label: source.label,
                        url: source.url,
                        vod_name: vod.vod_name,
                        poster: vod.vod_pic,
                      })
                    "
                  >
                    {{ source.label }}
                  </UButton>
                </div>
              </template>
            </UAccordion>
          </template>
        </UAccordion>
      </div>
      <Comment class="mt-4" :reply-to="`movies:${route.params.id}`" />
    </div>
  </div>
</template>
