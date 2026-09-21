<script setup lang="ts">
import type { EditorSuggestionMenuItem, EditorToolbarItem } from '@nuxt/ui'
import { Extension, type KeyboardShortcutCommand } from '@tiptap/core'

const route = useRoute()
const { $trpc } = useNuxtApp()

const { data, error } = await useAsyncData('content',
  async () => {
    if (!route.query.id) return await $trpc.editor.create.mutate()
    return await $trpc.editor.get.query({ id: route.query.id as string })
  })
if (error.value) console.error(error.value)

const content = ref(data.value?.body ?? '')

const items: EditorToolbarItem[][] = [
  [
    { kind: 'undo', icon: 'i-lucide-undo', tooltip: { text: 'Undo' } },
    { kind: 'redo', icon: 'i-lucide-redo', tooltip: { text: 'Redo' } },
  ],
  [
    {
      icon: 'i-lucide-heading',
      tooltip: { text: 'Headings' },
      content: { align: 'start' },
      items: [
        { kind: 'heading', level: 1, icon: 'i-lucide-heading-1', label: 'Heading 1' },
        { kind: 'heading', level: 2, icon: 'i-lucide-heading-2', label: 'Heading 2' },
        { kind: 'heading', level: 3, icon: 'i-lucide-heading-3', label: 'Heading 3' },
      ],
    },
    {
      icon: 'i-lucide-list',
      tooltip: { text: 'Lists' },
      content: { align: 'start' },
      items: [
        { kind: 'bulletList', icon: 'i-lucide-list', label: 'Bullet List' },
        { kind: 'orderedList', icon: 'i-lucide-list-ordered', label: 'Ordered List' },
      ],
    },
    { kind: 'blockquote', icon: 'i-lucide-text-quote', tooltip: { text: 'Blockquote' } },
    { kind: 'codeBlock', icon: 'i-lucide-square-code', tooltip: { text: 'Code Block' } },
  ],
  [
    { kind: 'mark', mark: 'bold', icon: 'i-lucide-bold', tooltip: { text: 'Bold' } },
    { kind: 'mark', mark: 'italic', icon: 'i-lucide-italic', tooltip: { text: 'Italic' } },
    { kind: 'mark', mark: 'underline', icon: 'i-lucide-underline', tooltip: { text: 'Underline' } },
    { kind: 'mark', mark: 'strike', icon: 'i-lucide-strikethrough', tooltip: { text: 'Strikethrough' } },
    { kind: 'mark', mark: 'code', icon: 'i-lucide-code', tooltip: { text: 'Code' } },
  ],
]

const commands: EditorSuggestionMenuItem[][] = [
  [
    { type: 'label', label: 'Text' },
    { kind: 'paragraph', label: 'Paragraph', icon: 'i-lucide-type' },
    { kind: 'heading', level: 1, label: 'Heading 1', icon: 'i-lucide-heading-1' },
    { kind: 'heading', level: 2, label: 'Heading 2', icon: 'i-lucide-heading-2' },
    { kind: 'heading', level: 3, label: 'Heading 3', icon: 'i-lucide-heading-3' },
  ],
  [
    { type: 'label', label: 'Lists' },
    { kind: 'bulletList', label: 'Bullet List', icon: 'i-lucide-list' },
    { kind: 'orderedList', label: 'Numbered List', icon: 'i-lucide-list-ordered' },
  ],
  [
    { type: 'label', label: 'Insert' },
    { kind: 'blockquote', label: 'Blockquote', icon: 'i-lucide-text-quote' },
    { kind: 'codeBlock', label: 'Code Block', icon: 'i-lucide-square-code' },
    { kind: 'horizontalRule', label: 'Divider', icon: 'i-lucide-separator-horizontal' },
  ],
]

const toast = useToast()
const keymap = Extension.create({
  name: 'editorKeymap',
  addKeyboardShortcuts(): Record<string, KeyboardShortcutCommand> {
    return {
      'Mod-Shift-Enter': () => {
        if (!data.value) return true
        void $trpc.editor.update.mutate({ id: data.value.id, body: content.value })
          .catch(() => toast.add({
            title: 'Error saving content',
            description: 'Mod+Shift+Enter',
            color: 'error',
          }))
          .then(() => toast.add({
            title: 'Content saved',
            description: 'Mod+Shift+Enter',
            color: 'primary',
          }))
          .then(() => {
            if (!data.value?.id) return
            void navigateTo({ query: { id: data.value?.id }, replace: true })
          })
        return true
      },
    }
  },
})

const extensions: Extension[] = [
  keymap,
]
</script>

<template>
  <UContainer class="py-6 space-y-6">
    <UPageHeader
      :title="`Editor${data ? ` - ${data.id}` : ''}`"
      description="A rich text editor example built with Nuxt UI & TipTap (Markdown)."
    />

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      <UCard
        title="v-model (JSON)"
        :ui="{ body: 'p-0' }"
        class="overflow-hidden"
      >
        <pre
          class="p-4 text-xs font-mono text-muted-foreground bg-muted/50 overflow-auto h-96 whitespace-pre-wrap break-words"
        >{{ content }}</pre>
      </UCard>

      <UCard
        :ui="{ body: 'p-0' }"
        class="overflow-hidden"
      >
        <UEditor
          v-slot="{ editor }"
          v-model="content"
          content-type="markdown"
          placeholder="/ for commands"
          :ui="{ base: 'px-6 py-4 min-h-64' }"
          :extensions="extensions"
          class="prose dark:prose-invert bg-default"
        >
          <UEditorToolbar
            :editor="editor"
            :items="items"
            class="border-b border-muted px-4 py-2 overflow-x-auto"
          />

          <UEditorToolbar
            :editor="editor"
            :items="items"
            layout="bubble"
          />

          <UEditorSuggestionMenu
            :editor="editor"
            :items="commands"
          />
        </UEditor>
      </UCard>
    </div>
  </UContainer>
</template>
