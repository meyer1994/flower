<script setup lang="ts">
import type { FormSubmitEvent, TableColumn } from '@nuxt/ui'
import z from 'zod'

const { $trpc } = useNuxtApp()
const { data: files, refresh } = await useAsyncData('files',
  async () => await $trpc.files.list.query())

const schema = z.object({ files: z.array(z.instanceof(File)) })
type Schema = z.output<typeof schema>
const state = reactive<Partial<Schema>>({})

const onSubmit = async (e: FormSubmitEvent<Schema>) => {
  await Promise.all(e.data.files?.map(async (file) => {
    const form = new FormData()
    form.append('file', file)
    await $trpc.files.create.mutate(form)
  }))
  await refresh()
  state.files = []
}

const onDelete = async (id: string) => {
  await $trpc.files.delete.mutate({ id })
  await refresh()
}

type Item = NonNullable<typeof files['value']>[number]
const columns: TableColumn<Item>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'mimeType',
    header: 'MIME Type',
  },
  {
    accessorKey: 'url',
    header: 'URL',
  },
  {
    id: 'actions',
    header: 'Actions',
  },
]
</script>

<template>
  <UContainer class="py-6 space-y-6">
    <UCard
      title="Upload"
      :ui="{ body: 'flex flex-col gap-4' }"
    >
      <div class="flex flex-col gap-4">
        <UForm
          :schema="schema"
          :state="state"
          @submit="onSubmit"
        >
          <UFileUpload
            v-model="state.files"
            multiple
            layout="list"
            label="Drop file here"
            description="Any file up to 10MB"
            class="w-full min-h-48"
          />

          <UButton
            label="Upload"
            type="submit"
            icon="i-lucide-upload"
            class="self-start"
          />
        </UForm>
      </div>

      <UTable
        :data="files"
        :columns="columns"
      >
        <template #url-cell="{ row }">
          <ULink
            :href="row.original.url"
            target="_blank"
            icon="i-lucide-external-link"
          >
            <UIcon name="i-lucide-external-link" />
          </ULink>
        </template>

        <template #actions-cell="{ row }">
          <UButton
            icon="i-lucide-trash"
            color="error"
            variant="ghost"
            size="sm"
            @click="onDelete(row.original.id)"
          />
        </template>
      </UTable>
    </UCard>
  </UContainer>
</template>
