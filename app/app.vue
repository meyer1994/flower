<script setup lang="ts">
useHead({
  title: 'Edtr',
  titleTemplate: '%s - Edtr',
  meta: [
    {
      name: 'description',
      content: 'Edtr is a simple text editor built with Nuxt 4, Nuxt UI 4, tRPC, Drizzle ORM, Better Auth and Cloudflare Workers',
    },
  ],
})
</script>

<template>
  <UApp>
    <NuxtPage />
  </UApp>
</template>
