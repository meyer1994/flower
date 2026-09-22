<script setup lang="ts">
import { NodeViewWrapper, type NodeViewProps } from '@tiptap/vue-3';

const { $trpc } = useNuxtApp()
const props = defineProps<NodeViewProps>()

const { data, status } = useAsyncData('image',
  async () => await $trpc.files.get.query({ id: props.node.attrs.imageId }))
</script>

<template>
  <NodeViewWrapper>
    <NuxtImg
      v-if="status === 'success' && data"
      :key="data.key"
      :src="data.url"
      :alt="data.key"
      :title="`${data.key} (${data.size} bytes)`"
    />
    <USkeleton v-else />
  </NodeViewWrapper>
</template>
