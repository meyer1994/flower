<script setup lang="ts">
useHead({
  title: 'Flower',
  titleTemplate: '%s - Flower',
  meta: [
    {
      name: 'description',
      content: 'Nuxt 4 + Nuxt UI 4 + tRPC + Drizzle ORM + Better Auth + Cloudflare Workers',
    },
  ],
})
</script>

<template>
  <UApp>
    <NuxtPage />
  </UApp>
</template>

<style>
  html {
    scrollbar-gutter: stable;
  }
</style>
