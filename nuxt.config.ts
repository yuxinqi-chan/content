export default defineNuxtConfig({
  runtimeConfig: {
    app: {
      name: "Compilesoul",
    },
  },
  routeRules: {
    "/": { prerender: true },
  },
  css: ["@/assets/css/main.css"],
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
  ],
  colorMode: {
    classSuffix: "",
  },
  hub: {
    database: true,
    blob: true,
    kv: true,
  },
  devtools: {
    enabled: true,
  },
  compatibilityDate: "2024-09-22",
});
