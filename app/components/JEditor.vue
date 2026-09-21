<script setup lang="ts">
import type { EditorSuggestionMenuItem, EditorToolbarItem } from '@nuxt/ui'
import { Extension, type JSONContent, type KeyboardShortcutCommand } from '@tiptap/core'
import { ImageUpload } from '~/components/editor/extensions'
import { Handlers } from '~/components/editor/handler'

type Props = { id: string }
const props = defineProps<Props>()
const model = defineModel<JSONContent>({ required: true })

export type JEventSave = { id: string, content: JSONContent }

type Emits = {
  (e: 'save', payload: JEventSave): void
}
const emit = defineEmits<Emits>()

// left toolbar items
const itemsLeft: EditorToolbarItem<typeof Handlers>[][] = [
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
    { kind: 'imageUpload', icon: 'i-lucide-image', label: 'Add image' },
  ],
  [
    { kind: 'mark', mark: 'bold', icon: 'i-lucide-bold', tooltip: { text: 'Bold' } },
    { kind: 'mark', mark: 'italic', icon: 'i-lucide-italic', tooltip: { text: 'Italic' } },
    { kind: 'mark', mark: 'underline', icon: 'i-lucide-underline', tooltip: { text: 'Underline' } },
    { kind: 'mark', mark: 'strike', icon: 'i-lucide-strikethrough', tooltip: { text: 'Strikethrough' } },
    { kind: 'mark', mark: 'code', icon: 'i-lucide-code', tooltip: { text: 'Code' } },
  ],
]

// right toolbar items
const itemsRight: EditorToolbarItem[][] = [[{
  icon: 'i-lucide-save',
  tooltip: { text: 'Save' },
  onClick: () => emit('save', { id: props.id, content: model.value }),
  color: 'primary',
  variant: 'solid',
}]]

// commands
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

// extensions
const extensions = [
  ImageUpload,

  // custom keymap
  Extension.create({
    name: 'editorKeymap',
    addKeyboardShortcuts(): Record<string, KeyboardShortcutCommand> {
      return {
        // save on ctrl+shift+enter
        'Mod-Shift-Enter': () => {
          emit('save', { id: props.id, content: model.value })
          return true
        },
      }
    },
  }),
]
</script>

<template>
  <UEditor
    v-slot="{ editor }"
    v-model="model"
    content-type="json"
    placeholder="/ for commands"
    :ui="{ base: 'px-4 sm:px-6 py-4 min-h-64' }"
    :extensions="extensions"
    :handlers="Handlers"
    class="prose dark:prose-invert bg-default"
  >
    <div class="flex items-center justify-between">
      <UEditorToolbar
        :editor="editor"
        :items="itemsLeft"
        class="overflow-x-auto"
      />

      <UEditorToolbar
        :editor="editor"
        :items="itemsRight"
      />
    </div>

    <UEditorToolbar
      :editor="editor"
      :items="itemsLeft"
      layout="bubble"
    />

    <UEditorDragHandle
      :editor="editor"
      icon="i-lucide-grip-vertical"
    />

    <UEditorSuggestionMenu
      :editor="editor"
      :items="commands"
    />
  </UEditor>
</template>
