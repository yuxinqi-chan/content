<script setup lang="ts">
import type { stock_zh_a_daily } from "~/types/finance";

const props = defineProps<{
  symbol: string;
  timeframe?: "day" | "week" | "5m" | "15m" | "30m";
  title?: string;
}>();
const { t } = useI18n();

const { data } = await useFetch<stock_zh_a_daily[]>(
  "https://aktools.compilesoul.com/api/public/stock_zh_a_daily",
  {
    query: {
      symbol: props.symbol,
    },
    default: () => [],
  },
);
const option = computed<ECOption>(() => ({
  grid: {
    left: "10%",
    right: "10%",
    bottom: "15%",
  },
  xAxis: {
    type: "category",
    data: data.value?.map((item) => item.date),
    boundaryGap: false,
    axisLine: { onZero: false },
    splitLine: { show: false },
    min: "dataMin",
    max: "dataMax",
  },
  yAxis: {
    scale: true,
    splitArea: {
      show: true,
    },
  },
  series: [
    {
      type: "candlestick",
      data: data.value?.map((item) => [
        item.open,
        item.close,
        item.low,
        item.high,
      ]),
      markLine: {
        symbol: ["none", "none"],
        data: [
          {
            name: t("highest-value"),
            type: "max",
            valueDim: "highest",
            label: {
              formatter: "{b}: {c}",
            },
            lineStyle: {
              color: "red",
              type: "dashed",
            },
          },
          {
            name: t("lowest-value"),
            type: "min",
            valueDim: "lowest",
            label: {
              formatter: "{b}: {c}",
            },
            lineStyle: {
              color: "green",
              type: "dashed",
            },
          },
          {
            name: t("latest-price"),
            yAxis: data.value?.[data.value.length - 1]?.close,
            label: {
              formatter: "{b}: {c}",
            },
            lineStyle: {
              color: "blue",
              type: "dashed",
            },
          },
        ],
      },
    },
  ],
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "cross",
    },
  },
  dataZoom: [
    {
      type: "inside",
      start: 80,
      end: 100,
    },
    {
      show: true,
      type: "slider",
      top: "90%",
      start: 50,
      end: 100,
    },
  ],
}));
</script>

<template>
  <VChart :option="option" />
</template>
