<script setup lang="ts">
import type { stock_zh_a_daily } from "~/types/finance";

useHead({
  title: "ETF",
});
const { t } = useI18n();
const dayjs = useDayjs();
// 10years ago
const startDate = dayjs().subtract(5, "year").format("YYYYMMDD");
const chinaItems = ref([
  { title: "上证", symbol: "sh000001" },
  { title: "沪深300ETF", symbol: "sh510300" },
  // { title: "证券ETF", symbol: "sh512880" },
  // { title: "半导体芯片ETF", symbol: "sz159995" },
  { title: "创业板ETF", symbol: "sz159919" },
  { title: "科创50ETF", symbol: "sh588000" },
  // { title: "医疗ETF", symbol: "sh512010" },
  // { title: "光伏ETF", symbol: "sh515790" },
  // { title: "军工ETF", symbol: "sh512660" },
  // { title: "能源ETF", symbol: "sz159930" },
  // { title: "房地产ETF", symbol: "sh512200" },
  // { title: "运输ETF", symbol: "sz159666" },
  // { title: "矿业ETF", symbol: "sh561330" },
]);
const { data: chinaItemsData } = await useAsyncData("chinaItemsData", () =>
  Promise.all(
    chinaItems.value.map((etf) =>
      $fetch<stock_zh_a_daily[]>(
        "https://aktools.compilesoul.com/api/public/stock_zh_index_daily_em",
        {
          query: {
            symbol: etf.symbol,
            // start_date: startDate,
            // end_date: dayjs().format("YYYYMMDD"),
          },
        },
      ),
    ),
  ),
);

const option = computed<ECOption>(() => ({
  // grid: {
  //   left: "10%",
  //   right: "10%",
  //   bottom: "15%",
  // },
  xAxis: {
    type: "time",
  },
  yAxis: chinaItems.value.map((item, index) => ({
    type: "value",
    name: item.title,
    position: "left",
    offset: 80 * index,
    show: index === 0,
    axisLine: {
      show: true,
    },
  })),
  series: chinaItemsData.value?.map((item, index) => ({
    name: chinaItems.value[index].title,
    type: "line",
    showSymbol: false,
    yAxisIndex: index,
    data: item
      ?.filter((item) => item.date >= startDate)
      .map((item) => [item.date, item.close]),
  })),
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "cross",
    },
  },
  // dataZoom: [
  //   {
  //     type: "inside",
  //     start: 80,
  //     end: 100,
  //   },
  //   {
  //     show: true,
  //     type: "slider",
  //     top: "90%",
  //     start: 50,
  //     end: 100,
  //   },
  // ],
}));
</script>

<template>
  <div class="flex w-full flex-grow px-8">
    <div class="flex-1">
      <VChart :option="option" />
    </div>
    <!-- <Aside :links="links" class="w-64">
      <template #top>
        <ContentSearchButton />
      </template>
    </Aside> -->
  </div>
</template>
