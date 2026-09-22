<script setup lang="ts">
import { NodeViewWrapper, type NodeViewProps } from '@tiptap/vue-3'

defineProps<NodeViewProps>()
</script>

<template>
  <NodeViewWrapper>
    <USkeleton class="h-12 w-full" />
  </NodeViewWrapper>
</template>
