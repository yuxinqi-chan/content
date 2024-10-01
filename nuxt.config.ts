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
        includeAppSources: true,
        urls: ["/"],
        exclude: ["/profile", "/blogs/**"],
      },
      blogs: {
        includeAppSources: true,
        include: ["/blogs/**"],
      },
    },
  },
  routeRules: {
    "/blogs/**": { prerender: true },
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
    "@nuxthub/core",
    "nuxt-auth-utils",
    "@nuxt/content",
    "@nuxt/image",
    "@nuxthq/studio",
    "@nuxt/ui",
    "nuxt-og-image",
    "@nuxtjs/sitemap",
    "@nuxtjs/i18n",
    "dayjs-nuxt",
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
    "@formkit/auto-animate/nuxt",
    "@vueuse/nuxt",
    "@nuxtjs/turnstile",
    "nuxt-lodash",
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
  devtools: {
    enabled: true,
  },
  compatibilityDate: "2024-09-22",
});
