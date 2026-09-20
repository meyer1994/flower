// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@vueuse/nuxt',
    '@nuxt/ui',
  ],

  devtools: {
    enabled: false,
    timeline: { enabled: true },
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    files: {
      bucket: '',
      endpoint: '',
      accessKeyId: '',
      secretAccessKey: '',
      region: 'auto',
    },
  },

  build: { transpile: ['trpc-nuxt'] },

  compatibilityDate: '2026-09-20',

  nitro: {
    preset: 'cloudflare_module',

    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
    },
  },

  vite: {
    optimizeDeps: {
      include: [
        '@trpc/client',
        '@trpc/client/links/loggerLink',
        'better-auth/vue',
        'zod',
      ],
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
