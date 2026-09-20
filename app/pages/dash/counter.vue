<script setup lang="ts">
const { $trpc } = useNuxtApp()

const { data, refresh } = await useAsyncData('counter',
  async () => await $trpc.counter.get.query())
</script>

<template>
  <UContainer class="py-6">
    <UCard
      :title="`Counter: ${data?.count}`"
      :ui="{ body: 'flex gap-4' }"
    >
      <UButton
        label="Increment"
        icon="i-heroicons-plus"
        @click="async () => {
          await $trpc.counter.inc.mutate()
          await refresh()
        }"
      />
      <UButton
        label="Decrement"
        icon="i-heroicons-minus"
        @click="async () => {
          await $trpc.counter.dec.mutate()
          await refresh()
        }"
      />
    </UCard>
  </UContainer>
</template>
