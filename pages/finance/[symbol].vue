<script lang="ts" setup>
const route = useRoute();
const symbol = route.params.symbol as string;
const ma = ref("no");
const datalen = ref("1023");
</script>
<template>
  <FinanceChart
    :key="symbol"
    :symbol="symbol"
    :ma="ma"
    :datalen="datalen"
    :title="symbol"
  />
</template>
