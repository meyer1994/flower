<script setup lang="ts">
import type { AppRouterOutputs } from '@@/server/trpc'
import type { TableColumn } from '@nuxt/ui'

type Item = AppRouterOutputs['files']['list'][number]

type Props = {
  items: Item[]
  loading?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update-file': [file: Item]
  'delete-file': [file: Item]
  'select-file': [file: Item]
  'refresh-table': []
}>()

// url is shown in the actions column
type Keys = keyof Omit<Item, 'url'> | 'actions'

// Table columns
const columns: TableColumn<Item>[] = [
  {
    id: 'key' as const,
    accessorKey: 'key',
    header: 'Key',
  },
  {
    id: 'size' as const,
    accessorKey: 'size',
    header: 'Size',
  },
  {
    id: 'lastModified' as const,
    accessorKey: 'lastModified',
    header: 'Last Modified',
  },
  {
    id: 'actions' as const,
    header: 'Ações',
  },
]

const MAP_ID_TO_LABEL: Record<string, string> = columns
  .reduce((a, c) => ({ ...a, [c.id as string]: c.header }), {})

// State for column visibility
const visible: Ref<Record<Keys, boolean>> = ref({
  key: true,
  size: true,
  lastModified: true,
  actions: true,
})

const table = useTemplateRef('table')

// Helper function to format bytes
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`
}
</script>

<template>
  <div class="flex flex-col flex-1 w-full">
    <!-- Filter and column controls -->
    <div class="flex items-center gap-2 px-4 py-3.5 border-b border-accented">
      <slot name="top" />

      <UButton
        icon="i-lucide-refresh-cw"
        color="neutral"
        variant="ghost"
        size="sm"
        title="Atualizar"
        class="ml-auto"
        @click="e => emit('refresh-table')"
      />

      <UDropdownMenu
        :items="
          table
            ?.tableApi
            ?.getAllColumns()
            .filter((column) => column.getCanHide())
            .map((column) => ({
              label: (MAP_ID_TO_LABEL[column.id as Keys] ?? column.id),
              type: 'checkbox' as const,
              checked: column.getIsVisible(),
              onUpdateChecked: (checked: boolean) =>
                table
                  ?.tableApi
                  ?.getColumn(column.id)
                  ?.toggleVisibility(!!checked),
              // prevents the select menu from closing
              onSelect: (e: Event) => e.preventDefault(),
            }))
        "
        :content="{ align: 'end' }"
      >
        <UButton
          label="Colunas"
          color="neutral"
          variant="outline"
          trailing-icon="i-lucide-chevron-down"
          aria-label="Selecionar colunas"
        />
      </UDropdownMenu>
    </div>

    <!-- Table -->
    <UTable
      ref="table"
      v-model:column-visibility="visible"
      :loading="props.loading"
      loading-animation="carousel"
      :columns="columns"
      :data="props.items"
      :sticky="true"
      :empty-state="{
        icon: 'i-lucide-box',
        label: 'No files found',
      }"
      :ui="{
        tr: 'hover:bg-muted cursor-pointer',
      }"
      class="flex-1"
      @select="(e, row) => emit('select-file', row.original)"
    >
      <!-- Key Column -->
      <template #key-cell="{ row }">
        <span class="text-sm font-mono">
          {{ row.original?.key || 'N/A' }}
        </span>
      </template>

      <!-- Size Column -->
      <template #size-cell="{ row }">
        <span class="text-sm">
          {{ row.original?.size
            ? formatBytes(row.original.size)
            : 'N/A' }}
        </span>
      </template>

      <!-- Last Modified Column -->
      <template #lastModified-cell="{ row }">
        <NuxtTime
          v-if="row.original?.lastModified"
          :datetime="row.original.lastModified"
          title
        />
        <span v-else>N/A</span>
      </template>

      <!-- Actions Column -->
      <template #actions-cell="{ row }">
        <div class="flex items-center gap-1">
          <UButton
            icon="i-lucide-download"
            color="primary"
            variant="ghost"
            size="sm"
            title="Download file"
            :disabled="!row.original.url"
            :href="row.original.url || '#'"
            target="_blank"
          />
          <UButton
            icon="i-lucide-trash-2"
            color="error"
            variant="ghost"
            size="sm"
            title="Delete file"
            @click="emit('delete-file', row.original)"
          />
        </div>
      </template>
    </UTable>
  </div>
</template>
