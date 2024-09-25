<script lang="ts" setup>
const config = useRuntimeConfig();

useHead({
  titleTemplate: (title) =>
    title ? `${title} - ${config.app.name}` : config.app.name,
});
</script>

<template>
  <div>
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtRouteAnnouncer />
      <NuxtPage />
    </NuxtLayout>

    <UNotifications />
  </div>
</template>
