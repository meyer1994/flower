<script setup lang="ts">
import { NodeViewWrapper, type NodeViewProps } from '@tiptap/vue-3';

const { $trpc } = useNuxtApp()
const props = defineProps<NodeViewProps>()

const { data, error } = useAsyncData(`ai-${props.node.attrs.aiId}`,
  async () => await $trpc.ai.get.query({ id: props.node.attrs.aiId }))
</script>

<template>
  <NodeViewWrapper>
    <UIcon
      name="i-lucide-wand-sparkles"
      class="text-primary mr-2"
    />
    <span>{{ data?.response ?? '-' }}</span>
    <span v-if="error">{{ error }}</span>
  </NodeViewWrapper>
</template>
