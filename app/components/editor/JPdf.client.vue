<script setup lang="ts">
import { NodeViewWrapper, type NodeViewProps } from '@tiptap/vue-3'

const { $trpc } = useNuxtApp()
const props = defineProps<NodeViewProps>()

const { data, status } = useAsyncData(`pdf-${props.node.attrs.pdfId}`,
  async () => await $trpc.files.get.query({ id: props.node.attrs.pdfId }),
  { server: false },
)
</script>

<template>
  <NodeViewWrapper>
    <USkeleton
      v-if="status !== 'success' || !data"
      class="h-96 w-full"
    />
    <embed
      v-else-if="status === 'success' && data"
      :src="data.url"
      type="application/pdf"
      class="h-96 w-full"
    >
  </NodeViewWrapper>
</template>
