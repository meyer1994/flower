// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@vueuse/nuxt', '@nuxt/ui', 'nitro-cloudflare-dev'],

  devtools: {
    enabled: false,
    timeline: {
      enabled: true,
    },
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    files: {
      aws: {
        bucket: process.env.NUXT_FILES_AWS_BUCKET,
        endpoint: process.env.NUXT_FILES_AWS_ENDPOINT,
        accessKeyId: process.env.NUXT_FILES_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.NUXT_FILES_AWS_SECRET_ACCESS_KEY,
        region: process.env.NUXT_FILES_AWS_REGION,
      },
    },
    database: {
      url: process.env.DATABASE_URL,
    },
  },

  build: {
    transpile: ['trpc-nuxt'],
  },

  compatibilityDate: '2025-05-15',

  nitro: {
    preset: 'cloudflare_module',

    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
    },

    database: {
      default: {
        connector: 'cloudflare-d1',
        options: {
          databaseURL: process.env.DATABASE_URL,
        },
      },
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
