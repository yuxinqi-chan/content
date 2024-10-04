<script lang="ts" setup>
import type { TmdbTvDetail } from "~/types/tmdb";
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
const { data: tmdbData } = await useFetch<TmdbTvDetail>(
  `/api/tmdb/tv/${route.params.id}`,
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
    tmdbData.value?.name ||
    tmdbData.value?.original_name ||
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
    label: t("Tv"),
    icon: "i-heroicons-tv",
    to: "/tv",
  },
  {
    label: title.value,
    icon: "i-heroicons-link",
  },
];

const videoPlayerRef = ref();
const { data: providersData } = await useFetch("/api/vodprovide", {
  query: {
    wd: title.value,
  },
  default: () => [],
});
const openedProviderName = useRouteQuery(
  "provider",
  () => providersData.value?.[0].name,
);
const openedProvider = computed(() =>
  providersData.value?.find((p) => p.name === openedProviderName.value),
);
const openedVodId = useRouteQuery(
  "vod_id",
  () => openedProvider.value?.list[0]?.vod_id,
  {
    transform: Number,
  },
);
const openedVod = computed(() =>
  openedProvider.value?.list.find((v) => v.vod_id === openedVodId.value),
);
const openedVideoLabel = useRouteQuery("label");
const opendVideo = computed(() => {
  if (openedVod.value) {
    return urlsToList(openedVod.value.vod_play_url).find(
      (v) => v.label === openedVideoLabel.value,
    );
  }
});
const providerItems = computed(() => {
  return providersData.value?.map((p) => {
    return {
      ...p,
      list: p.list.map((vod) => {
        return {
          ...vod,
          defaultOpen: vod.vod_id === openedVodId.value,
        };
      }),
      defaultOpen: p.name === openedProviderName.value,
    };
  });
});
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
function playVideo(provider: string, vod_id: number, label: string) {
  openedProviderName.value = provider;
  openedVodId.value = vod_id;
  openedVideoLabel.value = label;
  const player = document.getElementById("player");
  if (player) {
    player.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }
}
useIntervalFn(() => {
  if (
    openedProvider.value &&
    openedVod.value &&
    opendVideo.value &&
    videoPlayerRef.value
  ) {
    if (videoPlayerRef.value.currentTime()) {
      localStorage.setItem(
        `${openedProvider.value.name}:${openedVod.value.vod_id}:${opendVideo.value.label}`,
        videoPlayerRef.value.currentTime(),
      );
    }
  }
}, 5000);
function playerMounted(player: any) {
  videoPlayerRef.value = player;
  if (
    openedProvider.value &&
    openedVod.value &&
    opendVideo.value &&
    import.meta.client
  ) {
    const currentTime = Number(
      localStorage.getItem(
        `${openedProvider.value.name}:${openedVod.value.vod_id}:${opendVideo.value.label}`,
      ) || 0,
    );
    player.currentTime(currentTime);
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
      v-if="providersData"
    >
      <div v-if="opendVideo && openedVod" class="text-xl font-bold">
        {{ `${openedVod.vod_name}: ${opendVideo.label}` }}
      </div>
      <ClientOnly v-if="opendVideo">
        <video-player
          id="player"
          :src="opendVideo.url"
          :poster="`https://media.themoviedb.org/t/p/w1920_and_h800_multi_faces/${tmdbData?.backdrop_path}`"
          autoplay
          controls
          fluid
          @mounted="({ player }) => playerMounted(player)"
        />
      </ClientOnly>
      <div>
        <UAccordion :items="providerItems">
          <template #default="{ item: provider, index, open }">
            <UButton
              color="gray"
              variant="ghost"
              class="border-b border-gray-200 dark:border-gray-700"
              :ui="{ rounded: 'rounded-none', padding: { sm: 'p-3' } }"
            >
              <span class="truncate">{{ provider.label }}</span>
              <UBadge size="xs" color="gray" variant="solid">
                {{ `${provider.list.length}${t("Related Resources")}` }}
              </UBadge>
              <UButton
                icon="i-heroicons-arrow-top-right-on-square"
                size="sm"
                variant="ghost"
                color="gray"
                square
                :to="provider.site"
                target="_blank"
              />
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
              <template #default="{ item: vod, index, open }">
                <UButton
                  color="gray"
                  variant="ghost"
                  class="border-b border-gray-200 dark:border-gray-700"
                  :ui="{ rounded: 'rounded-none', padding: { sm: 'p-3' } }"
                >
                  <span class="truncate">{{ vod.label }}</span>
                  <UBadge
                    size="xs"
                    color="gray"
                    variant="solid"
                    v-if="vod.vod_remarks || vod.vod_time"
                  >
                    <span class="mr-1" v-if="vod.vod_time">
                      {{ $dayjs(vod.vod_time).fromNow() }}
                    </span>
                    <span v-if="vod.vod_remarks">{{ vod.vod_remarks }}</span>
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
                    v-for="video in urlsToList(vod.vod_play_url)"
                    class="justify-center"
                    color="blue"
                    :key="video.label"
                    :variant="
                      video.label === opendVideo?.label &&
                      provider.name === openedProvider?.name &&
                      vod.vod_id === openedVod?.vod_id
                        ? 'solid'
                        : 'outline'
                    "
                    :disabled="
                      video.label === opendVideo?.label &&
                      provider.label === openedProvider?.name &&
                      vod.vod_id === openedVod?.vod_id
                    "
                    @click="playVideo(provider.name, vod.vod_id, video.label)"
                  >
                    {{ video.label }}
                  </UButton>
                </div>
              </template>
            </UAccordion>
          </template>
        </UAccordion>
        <Comment class="mt-4" :reply-to="`tv:${route.params.id}`" />
      </div>
    </div>
  </div>
</template>
