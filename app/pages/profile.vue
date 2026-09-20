<script setup lang="ts">
const { $auth } = useNuxtApp()
const { data: session, error } = await $auth.useSession()
if (error.value) throw createError(error.value)
</script>

<template>
  <UContainer>
    <UCard :ui="{ header: 'flex items-center gap-2' }">
      <template #header>
        <UButton
          icon="i-lucide-arrow-left"
          to="/dash"
          variant="ghost"
        />

        <h1 class="text-lg font-bold">
          Perfil
        </h1>
      </template>

      <pre>{{ session }}</pre>
    </UCard>
  </UContainer>
</template>
