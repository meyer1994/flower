<script setup lang="ts">
import { NodeViewWrapper, type NodeViewProps } from '@tiptap/vue-3'

const props = defineProps<NodeViewProps>()

const { $trpc } = useNuxtApp()
const state = reactive<{ file?: File }>({})

const onSubmit = async (file: File) => {
  if (!file) return

  const form = new FormData()
  form.append('file', file)
  const data = await $trpc.files.create.mutate(form)

  props.editor
    .chain()
    .focus()
    .insertJPdf({ pdfId: data.id })
    .run()
}
</script>

<template>
  <NodeViewWrapper>
    <UFileUpload
      v-model="state.file"
      accept="application/pdf"
      label="Upload a PDF"
      description="PDF documents up to 10MB"
      :preview="false"
      @update:model-value="async e => e && await onSubmit(e)"
    />
  </NodeViewWrapper>
</template>
