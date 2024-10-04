<script setup lang="ts">
const props = defineProps<{
  symbol: string;
  timeframe?: "day" | "week" | "5m" | "15m" | "30m";
  ma: string;
  datalen: string;
  title?: string;
}>();
const scale = computed(() => {
  switch (props.timeframe) {
    case "day":
      return "240";
    case "week":
      return "1200";
    case "5m":
      return "5";
    case "15m":
      return "15";
    case "30m":
      return "30";
    default:
      return "240";
  }
});
const { data } = await useFetch("/api/finance", {
  query: {
    symbol: props.symbol,
    scale: scale,
    ma: props.ma,
    datalen: props.datalen,
  },
  default: () => [],
});
const option = computed<ECOption>(() => ({
  title: {
    text: props.title ? `${props.title} ${props.symbol}` : props.symbol,
  },
  xAxis: {
    data: data.value?.map((item) => item.day),
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
        item.high,
        item.low,
        item.close,
      ]),
    },
  ],
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "cross",
    },
  },
}));
</script>

<template>
  <VChart :option="option" />
</template>
