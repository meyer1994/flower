// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@vueuse/nuxt', '@nuxt/ui', 'nitro-cloudflare-dev'],

  devtools: {
    enabled: false,
    timeline: { enabled: true },
  },

  css: ['~/assets/css/main.css'],

  build: { transpile: ['trpc-nuxt'] },

  compatibilityDate: '2026-05-19',

  nitro: {
    preset: 'cloudflare_module',

    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
    },
  },

  typescript: {
    typeCheck: false,
    strict: true,
  },

  eslint: {
    checker: false,
    config: { stylistic: true },
  },
})
