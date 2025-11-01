<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui'
import type { FormFileData } from './components/FormFile.vue'
import FormFile from './components/FormFile.vue'

const route = useRoute()
const router = useRouter()

const { $trpc } = useNuxtApp()
const { data: usersData, refresh: refreshUsers } = $trpc.users.list.useQuery()
const { data: filesData, refresh: refreshFiles } = $trpc.files.list.useQuery()

const items = [
  {
    label: 'Users',
    value: 'users',
    slot: 'users' as const,
  },
  {
    label: 'Files',
    value: 'files',
    slot: 'files' as const,
  },
] satisfies TabsItem[]

const active = computed({
  get: () => (route.query.tab as string) || 'users',
  set: (v: string) => router.push({ query: { tab: v } }),
})

const onFileSubmit = async (e: FormFileData) => {
  if (!e.file) return
  const form = new FormData()
  form.append('key', e.file.name)
  form.append('file', e.file)
  await $trpc.files.put.mutate(form)
  await refreshFiles()
}
</script>

<template>
  <UApp>
    <div class="flex flex-col gap-4 p-4">
      <UTabs
        v-model="active"
        :items="items"
        class="w-full"
      >
        <template #users>
          <div class="flex flex-col gap-4">
            <FormUser
              @submit="async (e) => {
                await $trpc.users.create.mutate(e)
                await refreshUsers()
              }"
            />
            <TableUsers
              :items="usersData || []"
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
          </div>
        </template>

        <template #files>
          <div class="flex flex-col gap-4">
            <FormFile
              @submit="async (e) => await onFileSubmit(e)"
            />
            <TableFiles
              :items="filesData || []"
              @refresh-table="async () => {
                await refreshFiles()
              }"
              @delete-file="async (e) => {
                // TODO: Implement file delete if needed
                await refreshFiles()
              }"
              @select-file="async (e) => {
                // TODO: Handle file selection if needed
              }"
            />
          </div>
        </template>
      </UTabs>
    </div>
  </UApp>
</template>
