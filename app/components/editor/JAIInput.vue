<script setup lang="ts">
import { NodeViewWrapper, type NodeViewProps } from '@tiptap/vue-3'

const { $trpc } = useNuxtApp()
const props = defineProps<NodeViewProps>()

const input = ref('')
const { status, error, execute } = useAsyncData(`ai-input-${props.node.attrs.aiId}`, async () => {
  const response = await $trpc.ai.ask.mutate({ prompt: input.value })
  props.editor
    .chain()
    .focus()
    .insertJAi({ aiId: response.id })
    .run()
}, { server: false, immediate: false })
</script>

<template>
  <NodeViewWrapper>
    <div>
      <div>
        <UIcon name="i-lucide-wand-sparkles" />
        <span>AI Prompt</span>
      </div>

      <UChatPrompt
        v-model="input"
        placeholder="ask anything..."
        :loading="status === 'pending'"
        :disabled="status === 'pending'"
        @submit="() => execute()"
      >
        <UChatPromptSubmit />
      </UChatPrompt>

      <p v-if="error">
        {{ error }}
      </p>
    </div>
  </NodeViewWrapper>
</template>
