import { z } from "zod";
import { H3Event } from "h3";

type KLineData = {
  day: string;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  amount: string;
};
type QfqData = {
  total: number;
  data: {
    d: string;
    f: string;
    s: string;
    u: string;
  }[];
};
export default cachedEventHandler(
  async (event) => {
    const { symbol, scale, ma, datalen } = await getValidatedQuery(
      event,
      z.object({
        symbol: z.string(),
        scale: z.string(),
        ma: z.string(),
        datalen: z.string(),
      }).parse,
    );
    const timestamp = Date.now();
    const url = `https://quotes.sina.cn/cn/api/jsonp_v2.php/var%20_${symbol}_${scale}_${timestamp}=/CN_MarketDataService.getKLineData`;
    const klineJsonp = await $fetch<string>(url, {
      query: {
        symbol,
        scale,
        ma,
        datalen,
      },
      responseType: "text",
    });
    // 使用正则表达式提取括号内的内容
    const klineJsonMatch = klineJsonp.match(/\((.+)\)/);
    if (!klineJsonMatch) {
      console.error("无法从 JSONP 响应中提取数据", klineJsonp);
      throw new Error("无法从 JSONP 响应中提取数据");
    }
    if (klineJsonMatch[1] === "null") {
      return [];
    }
    // 解析提取的内容为 JSON
    const klineJson = JSON.parse(klineJsonMatch[1]) as KLineData[];
    const qfqJsonp = await $fetch<string>(
      `https://finance.sina.com.cn/realstock/company/${symbol}/qfq.js`,
      {
        responseType: "text",
      },
    );
    const qfqJson = JSON.parse(qfqJsonp.match(/(\{.+\})/)![1]) as QfqData;
    klineJson.forEach((item) => {
      const qfqNumber = Number(
        qfqJson.data.find((fq) => item.day.substring(0, 10) >= fq.d)?.s || 1,
      );
      item.open = (Number(item.open) / qfqNumber).toString();
      item.high = (Number(item.high) / qfqNumber).toString();
      item.low = (Number(item.low) / qfqNumber).toString();
      item.close = (Number(item.close) / qfqNumber).toString();
    });
    // 返回解析后的 JSON 数据
    return klineJson;
  },
  {
    maxAge: 60 * 60 * 12,
    getKey: (event: H3Event) => event.path,
  },
);
