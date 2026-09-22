<script setup lang="ts">
import { NodeViewWrapper, type NodeViewProps } from '@tiptap/vue-3';
import type { UIMessage } from 'ai';
import { uuidv7 } from 'uuidv7';

const { $trpc } = useNuxtApp()
const props = defineProps<NodeViewProps>()
const chatId = props.node.attrs.chatId ?? uuidv7()
props.updateAttributes({ chatId })

const { data, refresh } = useAsyncData(
  async () => await $trpc.chat.list.query({ chatId }))

const messages = computed<UIMessage[]>(() => {
  return data.value?.map(message => ({
    id: message.id,
    role: message.role,
    parts: [{ type: 'text', text: message.text }],
  })) ?? []
})

const input = ref('')
const { execute: send, status } = useAsyncData(async () => {
  await $trpc.chat.ask.mutate({ chatId, text: input.value })
  await refresh()
  input.value = ''
}, { immediate: false, server: false })
</script>

<template>
  <NodeViewWrapper>
    <UChatMessages
      :compact="true"
      :loading="status === 'pending'"
      :status="
        status === 'success' ? 'ready'
        : status === 'error' ? 'error'
          : 'submitted'"
      :messages="messages"
      class="h-96 overflow-y-auto"
    />

    <UChatPrompt
      v-model="input"
      placeholder="Type a message…"
      :loading="status === 'pending'"
      :disabled="status === 'pending'"
      @submit="async () => await send()"
    >
      <UChatPromptSubmit />
    </UChatPrompt>
  </NodeViewWrapper>
</template>
