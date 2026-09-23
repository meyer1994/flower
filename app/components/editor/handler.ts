import type { Editor } from '@tiptap/core'

export const Handlers = {
  jPlaceholder: {
    canExecute: (editor: Editor) => editor.can().insertContent({ type: 'jPlaceholder' }),
    execute: (editor: Editor) => editor.chain().focus().insertContent({ type: 'jPlaceholder' }),
    isActive: (editor: Editor) => editor.isActive('jPlaceholder'),
    isDisabled: undefined,
  },
  jAiChat: {
    canExecute: (editor: Editor) => editor.can().insertContent({ type: 'jAiChat' }),
    execute: (editor: Editor) => editor.chain().focus().insertContent({
      type: 'jAiChat',
      attrs: { chatId: crypto.randomUUID() },
    }),
    isActive: (editor: Editor) => editor.isActive('jAiChat'),
    isDisabled: undefined,
  },
  jAiInput: {
    canExecute: (editor: Editor) => editor.can().insertContent({ type: 'jAiInput' }),
    execute: (editor: Editor) => editor.chain().focus().insertContent({
      type: 'jAiInput',
      attrs: { aiId: crypto.randomUUID() },
    }),
    isActive: (editor: Editor) => editor.isActive('jAiInput'),
    isDisabled: undefined,
  },
  jAi: {
    canExecute: (editor: Editor) => editor.can().insertContent({ type: 'jAi' }),
    execute: (editor: Editor) => editor.chain().focus().insertContent({
      type: 'jAi',
      attrs: { id: crypto.randomUUID() },
    }),
    isActive: (editor: Editor) => editor.isActive('jAi'),
    isDisabled: undefined,
  },
  jImageUpload: {
    canExecute: (editor: Editor) => editor.can().insertContent({ type: 'jImageUpload' }),
    execute: (editor: Editor) => editor.chain().focus().insertContent({ type: 'jImageUpload' }),
    isActive: (editor: Editor) => editor.isActive('jImageUpload'),
    isDisabled: undefined,
  },
  jAudioUpload: {
    canExecute: (editor: Editor) => editor.can().insertContent({ type: 'jAudioUpload' }),
    execute: (editor: Editor) => editor.chain().focus().insertContent({ type: 'jAudioUpload' }),
    isActive: (editor: Editor) => editor.isActive('jAudioUpload'),
    isDisabled: undefined,
  },
  jPdfUpload: {
    canExecute: (editor: Editor) => editor.can().insertContent({ type: 'jPdfUpload' }),
    execute: (editor: Editor) => editor.chain().focus().insertContent({ type: 'jPdfUpload' }),
    isActive: (editor: Editor) => editor.isActive('jPdfUpload'),
    isDisabled: undefined,
  },
} as const
