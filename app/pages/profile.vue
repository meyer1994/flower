<script setup lang="ts">
const { $auth } = useNuxtApp()
const { data: session } = await $auth.useSession()
</script>

<template>
  <UContainer>
    <pre>{{ session }}</pre>
  </UContainer>
</template>
