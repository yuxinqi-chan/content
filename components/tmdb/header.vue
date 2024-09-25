<script lang="ts" setup>
const props = defineProps<{
  data: {
    backdrop_path: string;
    poster_path: string;
    title?: string;
    original_title?: string;
    name?: string;
    original_name?: string;
    release_date?: string;
    first_air_date?: string;
    genres: { name: string }[];
    runtime?: number;
    vote_average: number;
    overview: string;
  };
}>();
const title = computed(
  () =>
    props.data.title ||
    props.data.name ||
    props.data.original_title ||
    props.data.original_name ||
    "",
);
const releaseDate = computed(
  () => props.data.release_date || props.data.first_air_date,
);
const overviewLines = computed(() => props.data.overview.split(/[\r\n]/));
const voteAverage = computed(() => (props.data.vote_average || 0) * 10);
const voteColor = computed(() => {
  if (voteAverage.value >= 80) return "green";
  if (voteAverage.value >= 40) return "yellow";
  return "red";
});
</script>

<style scoped>
.media-bg {
  background-position: left calc((50vw - 170px) - 340px) top;
  background-size: cover;
  background-repeat: no-repeat;
  background-origin: padding-box;
  background-attachment: scroll;
  background-clip: border-box;
}
.custom-bg {
  background-image: linear-gradient(
    to right,
    rgba(31.5, 31.5, 31.5, 1) calc((50vw - 170px) - 340px),
    rgba(31.5, 31.5, 31.5, 0.84) 50%,
    rgba(31.5, 31.5, 31.5, 0.84) 100%
  );
}
</style>

<template>
  <div
    v-if="data"
    class="media-bg"
    :style="{
      'background-image': `url('https://media.themoviedb.org/t/p/w1920_and_h800_multi_faces/${data.backdrop_path}')`,
    }"
  >
    <div class="custom-bg flex justify-center">
      <div class="flex max-w-[1400px] gap-10 px-[40px] py-[30px] text-white">
        <div class="h-[450px] w-[300px] shrink-0 overflow-hidden rounded-2xl">
          <NuxtImg
            :src="`https://media.themoviedb.org/t/p/w300_and_h450_bestv2${data.poster_path}`"
            alt="Image"
            width="300"
            height="450"
          />
        </div>
        <div class="flex flex-col gap-4">
          <div class="text-4xl">
            <span class="font-bold">
              {{ title }}
            </span>
            <span class="text-gray-300">
              ({{ $dayjs(releaseDate).format("YYYY") }})
            </span>
          </div>
          <div class="flex gap-2 text-lg">
            <span>{{ releaseDate }}</span>
            <span>•</span>
            <span>
              {{ data.genres.map((genre) => genre.name).join(", ") }}
            </span>
            <template v-if="data.runtime">
              <span>•</span>
              <span>
                {{
                  $dayjs.duration(data.runtime, "minutes").format("H[h] m[m]")
                }}
              </span>
            </template>
          </div>
          <div class="flex flex-col gap-2">
            <span class="text-2xl font-bold">
              {{ $t("Vote Average") }}
            </span>
            <UProgress
              class="w-40"
              :value="voteAverage"
              :color="voteColor"
              indicator
            />
          </div>
          <div class="flex flex-col gap-2">
            <span class="text-2xl font-bold">{{ $t("Overview") }}</span>
            <p class="text-lg" v-for="(line, i) in overviewLines" :key="i">
              {{ line }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
