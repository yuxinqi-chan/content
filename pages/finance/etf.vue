<script setup lang="ts">
useHead({
  title: "ETF",
});
const etfs = ref([
  { title: "沪深300ETF", symbol: "sh510300" },
  { title: "证券ETF", symbol: "sh512880" },
  { title: "半导体芯片ETF", symbol: "sz159995" },
  { title: "创业板ETF", symbol: "sz159919" },
  { title: "科创50ETF", symbol: "sh588000" },
  { title: "医疗ETF", symbol: "sh512010" },
  { title: "光伏ETF", symbol: "sh515790" },
  { title: "军工ETF", symbol: "sh512660" },
  { title: "能源ETF", symbol: "sz159930" },
  { title: "房地产ETF", symbol: "sh512200" },
  { title: "运输ETF", symbol: "sz159666" },
  { title: "矿业ETF", symbol: "sh561330" },
]);
const ma = ref("no");
const datalen = ref("1023");
</script>

<template>
  <div class="grid flex-1 auto-rows-fr grid-cols-3 pt-2">
    <FinanceChart
      v-for="etf in etfs"
      :key="etf.symbol"
      :symbol="etf.symbol"
      :ma="ma"
      :datalen="datalen"
      :title="etf.title"
    />
  </div>
</template>
