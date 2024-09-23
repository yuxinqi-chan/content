<template>
  <div class="flex min-h-screen flex-col">
    <AppHeader />

    <main class="container mx-auto flex-grow px-4 py-8">
      <slot />
    </main>

    <AppFooter />
  </div>
</template>

<script lang="ts" setup>
// 如果需要，可以在这里添加任何必要的逻辑
</script>
