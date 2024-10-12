<script lang="ts" setup>
const { t } = useI18n();
const config = useRuntimeConfig();
const { data: blobs, refresh } = useFetch("/api/blobs", {
  query: {
    prefix: "images",
    limit: 15,
  },
  default: () => [],
});

const { execute, isReady, isLoading } = useAsync(async () => {
  const formData = new FormData();
  if (selectedFile.value) {
    formData.append("file", selectedFile.value);
  }
  formData.append("prefix", "images");
  await $fetch("/blobs", {
    method: "POST",
    server: false,
    immediate: false,
    body: formData,
  });
});

const selectedFile = ref<File | null>(null);

const createObjectURL = (file: File) => URL.createObjectURL(file);

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    selectedFile.value = target.files[0];
  }
};

const uploadImage = async () => {
  if (!selectedFile.value) return;

  await execute();

  if (isReady.value) {
    // Refresh the blobs list
    await refresh();
    selectedFile.value = null;
  }
};

function handleDrop(event: DragEvent) {
  const files = event.dataTransfer?.files;
  if (files && files.length > 0) {
    selectedFile.value = files[0];
  }
  event.preventDefault();
}
const { copy } = useClipboard();
</script>

<template>
  <UContainer class="container mt-4 flex flex-grow flex-col gap-4">
    <div>
      <!-- upload -->
      <div class="flex w-full flex-col items-center justify-center gap-4">
        <label
          for="dropzone-file"
          @dragover.prevent
          @dragenter.prevent
          @drop="handleDrop"
          class="flex h-96 w-full cursor-pointer flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-800"
        >
          <div
            v-if="!selectedFile"
            class="flex flex-col items-center justify-center pb-6 pt-5"
          >
            <svg
              class="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span class="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              SVG, PNG, JPG or GIF (MAX. 8MB)
            </p>
          </div>
          <img
            v-else
            :src="createObjectURL(selectedFile)"
            alt="selected file"
            class="max-h-full max-w-full object-contain"
          />
          <UProgress v-if="isLoading" animation="carousel" />
          <input
            id="dropzone-file"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleFileChange"
          />
        </label>
        <UButton
          v-if="selectedFile"
          size="lg"
          color="cyan"
          @click="uploadImage"
        >
          {{ t("upload") }}
        </UButton>
      </div>
    </div>
    <div
      class="grid grid-cols-[repeat(auto-fill,minmax(12rem,1fr))] gap-4 [&_img]:cursor-pointer"
      v-viewer
    >
      <!-- picture list -->
      <div
        v-for="blob in blobs"
        :key="blob.pathname"
        class="flex flex-col items-center gap-2"
      >
        <div
          class="flex h-48 w-48 items-center justify-center overflow-hidden rounded transition-all duration-300 hover:scale-105 hover:shadow-lg"
        >
          <img
            :src="`/blobs/${blob.pathname}`"
            :alt="blob.pathname"
            class="max-h-full max-w-full object-contain"
          />
        </div>
        <div class="flex items-center">
          <input
            type="text"
            class="rounded-l-md border border-r-0 border-gray-300 px-1 pr-0 focus:outline-none"
            :placeholder="blob.pathname.replace('images/', '')"
            readonly
          />
          <button
            class="flex items-center rounded-r-md border border-l-0 border-gray-300 p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
            @click="copy(`${config.app.url}/blobs/${blob.pathname}`)"
          >
            <UIcon name="i-mdi-link" />
          </button>
        </div>
      </div>
    </div>
  </UContainer>
</template>

<style></style>
