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
        // TipTap/ProseMirror must be pre-bundled as one graph or the browser
        // loads two copies of prosemirror-* (via @tiptap/pm AND @tiptap/y-tiptap)
        // -> keyed plugin collision / "Can not convert <> to a Fragment".
        // Same include as the official nuxt-ui-templates/editor config.
        '@nuxt/ui > prosemirror-state',
        '@nuxt/ui > prosemirror-transform',
        '@nuxt/ui > prosemirror-model',
        '@nuxt/ui > prosemirror-view',
        '@nuxt/ui > prosemirror-gapcursor',
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
