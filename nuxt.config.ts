export default defineNuxtConfig({
  app: {
    pageTransition: { name: "page", mode: "out-in" },
  },
  runtimeConfig: {
    app: {
      name: process.env.NUXT_APP_NAME,
    },
    cronToken: process.env.NUXT_CRON_TOKEN,
    tmdbAccessToken: process.env.NUXT_TMDB_ACCESS_TOKEN,
    turnstile: {
      secretKey: process.env.NUXT_TURNSTILE_SECRET_KEY,
    },
  },
  turnstile: {
    siteKey: process.env.NUXT_PUBLIC_TURNSTILE_SITE_KEY,
  },
  sitemap: {
    sitemaps: {
      pages: {
        urls: ["/"],
        sources: ["/api/__sitemap__/urls/pages"],
      },
      blogs: {
        sources: ["/api/__sitemap__/urls/blogs"],
      },
    },
  },
  css: ["@/assets/css/main.css"],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern",
        },
      },
    },
  },
  ui: {
    global: true,
  },
  content: {
    highlight: {
      langs: [
        "js",
        "jsx",
        "json",
        "ts",
        "tsx",
        "vue",
        "css",
        "html",
        "vue",
        "bash",
        "md",
        "mdc",
        "yaml",
        "py",
      ],
      theme: {
        dark: "github-dark",
        default: "github-light",
      },
    },
  },
  modules: [
    "nuxt-echarts",
    "@nuxthub/core",
    "nuxt-auth-utils",
    "@nuxt/content",
    "@nuxt/image",
    ...(process.env.NODE_ENV === "development" ? ["@nuxthq/studio"] : []),
    "@nuxt/ui",
    "@nuxtjs/i18n",
    "dayjs-nuxt",
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
    "@formkit/auto-animate/nuxt",
    "@vueuse/nuxt",
    "@nuxtjs/turnstile",
    "nuxt-lodash",
    "nuxt-og-image",
    "@nuxtjs/sitemap",
  ],
  i18n: {
    langDir: "lang",
    locales: [
      {
        code: "zh",
        file: "zh.json",
      },
      {
        code: "en",
        file: "en.json",
      },
    ],
    defaultLocale: "zh",
    strategy: "no_prefix",
    detectBrowserLanguage: {
      useCookie: true,
      redirectOn: "all",
    },
  },
  dayjs: {
    locales: ["en", "zh"],
    plugins: ["relativeTime", "utc", "timezone", "duration", "localizedFormat"],
    defaultLocale: "zh",
    defaultTimezone: "Asia/Shanghai",
  },
  colorMode: {
    classSuffix: "",
  },
  hub: {
    database: true,
    blob: true,
    kv: true,
    cache: true,
  },
  echarts: {
    charts: ["CandlestickChart"],
    components: [
      "DatasetComponent",
      "GridComponent",
      "TitleComponent",
      "TooltipComponent",
    ],
  },
  studio: {
    enabled: true,
  },
  devtools: {
    enabled: true,
  },
  compatibilityDate: "2024-09-22",
});
