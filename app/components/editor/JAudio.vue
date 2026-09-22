<script setup lang="ts">
import { NodeViewWrapper, type NodeViewProps } from '@tiptap/vue-3'

const { $trpc } = useNuxtApp()
const props = defineProps<NodeViewProps>()

const { data, status } = useAsyncData(`audio-${props.node.attrs.audioId}`,
  async () => await $trpc.files.get.query({ id: props.node.attrs.audioId }))
</script>

<template>
  <NodeViewWrapper>
    <audio
      v-if="status === 'success' && data"
      :src="data.url"
      :title="`${data.key} (${data.size} bytes)`"
      controls
      class="w-full"
    />
    <USkeleton
      v-else
      class="h-12 w-full"
    />
  </NodeViewWrapper>
</template>
