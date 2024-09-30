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
<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
