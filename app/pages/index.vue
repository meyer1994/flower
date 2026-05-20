<script setup lang="ts">
const { $trpc } = useNuxtApp()

const { data, refresh } = await useAsyncData('counter', () => $trpc.counter.get.query())

const increment = async () => {
  await $trpc.counter.increment.mutate()
  await refresh()
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <NavHeader />
    <UContainer>
      <UPageCard title="Counter">
        <div class="flex items-center gap-4">
          <span class="text-4xl font-bold">{{ data?.count ?? 0 }}</span>
          <UButton
            icon="i-lucide-plus"
            @click="increment"
          >
            Increment
          </UButton>
        </div>
      </UPageCard>
    </UContainer>
  </div>
</template>
