<script setup lang="ts">
defineProps({
  href: {
    type: String,
    required: true,
  },
  external: {
    type: Boolean,
    default: false,
  },
  icon: {
    type: String,
    default: "",
  },
});
</script>

<template>
  <span class="not-prose">
    <NuxtLink
      :to="href"
      :external="external"
      class="inline-flex items-center gap-1 rounded bg-gray-800 px-3 py-1 text-white no-underline dark:bg-gray-200 dark:text-gray-950"
    >
      <UIcon v-if="icon" :name="icon" class="h-4 w-4" />
      <ContentSlot :use="$slots.default" unwrap="p" />
    </NuxtLink>
  </span>
</template>
