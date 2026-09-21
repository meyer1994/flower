<script setup lang="ts">
import type { JSONContent } from '@tiptap/core'
import type { JEventSave } from '~/components/JEditor.vue'

const toast = useToast()
const route = useRoute()
const router = useRouter()
const { $trpc } = useNuxtApp()

const { data, error } = await useAsyncData('content',
  async () => {
    if (!route.query.id) return await $trpc.editor.create.mutate()
    return await $trpc.editor.get.query({ id: route.query.id as string })
  },
)
if (error.value) console.error(error.value)

const content = ref<JSONContent>(data.value?.body ?? { type: 'doc', content: [] })

const save = async (payload: JEventSave) => {
  try {
    if (!data.value) return
    await $trpc.editor.update.mutate({ id: payload.id, body: payload.content })
    toast.add({ title: 'Content saved', color: 'primary', duration: 1000 })
    router.replace({ query: { id: payload.id } })
  }
  catch (error) {
    console.error(error)
    toast.add({ title: 'Error saving content', color: 'error' })
  }
}
</script>

<template>
  <UContainer class="py-6 space-y-6">
    <UPageHeader
      :title="`Editor${data?.id ? ` - ${data.id}` : ''}`"
      description="A rich text editor example built with Nuxt UI & TipTap (Markdown)."
    />

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      <UCard
        :ui="{ body: 'p-0' }"
        class="overflow-hidden"
      >
        <JEditor
          v-if="data"
          :id="data.id"
          v-model="content"
          @save="save"
        />
      </UCard>

      <UCard
        :ui="{ body: 'p-0' }"
        class="overflow-hidden"
      >
        <pre
          class="p-4 text-xs font-mono text-muted-foreground bg-muted/50 overflow-auto h-96 whitespace-pre-wrap break-words"
        >{{ content }}</pre>
      </UCard>
    </div>
  </UContainer>
</template>
