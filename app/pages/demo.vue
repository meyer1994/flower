<script setup lang="ts">
import type { AppRouterOutputs } from '~~/server/trpc'

definePageMeta({ auth: true })

const { $trpc } = useNuxtApp()

const [
  { data: dataUsers, refresh: refreshUsers, error: errorUsers, status: statusUsers },
  { data: dataFiles, refresh: refreshFiles, error: errorFiles, status: statusFiles },
] = await Promise.all([
  $trpc.users.list.useQuery(undefined),
  $trpc.files.list.useQuery(undefined),
])

if (errorUsers.value) throw createError({
  statusCode: errorUsers.value.data?.httpStatus,
  statusMessage: JSON.stringify(errorUsers.value.data),
})

if (errorFiles.value) throw createError({
  statusCode: errorFiles.value.data?.httpStatus,
  statusMessage: JSON.stringify(errorFiles.value.data),
})

const onSubmitFile = async (e: File) => {
  const data = new FormData()
  data.append('file', e)
  await $trpc.files.create.mutate(data)
  await refreshFiles()
}

type ItemSearch = AppRouterOutputs['vector']['search'][number]

const searchResults = ref<ItemSearch[]>([])
const isSearching = ref(false)

const onSearch = async (e: { query: string, prefix?: string }) => {
  isSearching.value = true
  try {
    const results = await $trpc.vector.search.query(e)
    searchResults.value = results
  }
  finally {
    isSearching.value = false
  }
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <NavHeader />
    <UContainer class="flex flex-col gap-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UCard class="flex flex-col gap-4">
          <template #header>
            <h2 class="text-2xl font-bold">
              Database
            </h2>
          </template>

          <FormUser
            :loading="statusUsers === 'pending'"
            @submit="async (e) => {
              await $trpc.users.create.mutate(e)
              await refreshUsers()
            }"
          />

          <TableUsers
            :items="dataUsers || []"
            :loading="statusUsers === 'pending'"
            @refresh-table="async () => {
              await refreshUsers()
            }"
            @update-user="async (e) => {
              await $trpc.users.update.mutate(e)
              await refreshUsers()
            }"
            @delete-user="async (e) => {
              await $trpc.users.delete.mutate(e)
              await refreshUsers()
            }"
            @select-user="async (e) => {
              await $trpc.users.update.mutate(e)
              await refreshUsers()
            }"
          />
        </UCard>

        <UCard class="flex flex-col gap-4">
          <template #header>
            <h2 class="text-2xl font-bold">
              Files
            </h2>
          </template>

          <FormFile
            @submit="async (e) => {
              await onSubmitFile(e)
            }"
          />

          <TableFiles
            :items="dataFiles || []"
            :loading="statusFiles === 'pending'"
            @refresh-table="async () => {
              await refreshFiles()
            }"
            @download-file="async (e) => {

            }"
            @delete-file="async (e) => {
              await $trpc.files.delete.mutate({ key: e.key })
              await refreshFiles()
            }"
          />
        </UCard>
      </div>

      <UCard>
        <template #header>
          <h2 class="text-2xl font-bold flex items-center gap-2">
            <UIcon name="i-lucide-brain-circuit" />
            Vector Search
          </h2>
        </template>

        <div class="flex flex-col gap-6">
          <FormSearch @submit="onSearch" />

          <TableVectors
            :items="searchResults"
            :loading="isSearching"
            @refresh-table="() => searchResults = []"
          />
        </div>
      </UCard>
    </UContainer>
  </div>
</template>
