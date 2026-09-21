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
    .insertJImage({ imageId: data.id })
    .run()
}
</script>

<template>
  <NodeViewWrapper>
    <UFileUpload
      v-model="state.file"
      accept="image/*"
      label="Upload an image"
      description="SVG, PNG, JPG or GIF"
      :preview="false"
      @update:model-value="async e => e && await onSubmit(e)"
    />
  </NodeViewWrapper>
</template>
