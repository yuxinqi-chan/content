<template>
  <div class="flex min-h-screen flex-col">
    <AppHeader />

    <main class="flex-grow">
      <slot />
    </main>

    <AppFooter />
  </div>
</template>

<script lang="ts" setup>
// 如果需要，可以在这里添加任何必要的逻辑
</script>
