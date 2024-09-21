export default defineNuxtConfig({
  extends: 'content-wind',

  routeRules: {
    '/': { prerender: true }
  },

  modules: ['@nuxthub/core']
})