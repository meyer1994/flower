<script setup lang="ts">
useHead({
  title: 'flower',
  titleTemplate: '%s',
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
    <NuxtRouteAnnouncer />
    <NuxtLoadingIndicator />
    <NuxtPage />
  </UApp>
</template>

<style>
  html {
    scrollbar-gutter: stable;
  }
</style>
