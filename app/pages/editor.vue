<script setup lang="ts">
import type { EditorSuggestionMenuItem, EditorToolbarItem } from '@nuxt/ui';

const value = ref(`
# Hello, Editor

This is the Nuxt UI **Editor** component, powered by *TipTap*.

Select some text to reveal the bubble toolbar, or use the fixed toolbar above.

### Features
- **Bold** · *Italic* · <u>Underline</u> · ~~Strikethrough~~ · \`code\`
- Headings, lists, blockquotes and code blocks
- Markdown, HTML and JSON content

> Tip: use the fixed toolbar to add a code block or quote.
`)

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
</script>

<template>
  <UContainer class="py-6 space-y-6">
    <UPageHeader
      title="Editor"
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
        >{{ value }}</pre>
      </UCard>

      <UCard
        :ui="{ body: 'p-0' }"
        class="overflow-hidden"
      >
        <UEditor
          v-slot="{ editor }"
          v-model="value"
          content-type="markdown"
          placeholder="/ for commands"
          :ui="{ base: 'px-6 py-4 min-h-64' }"
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
