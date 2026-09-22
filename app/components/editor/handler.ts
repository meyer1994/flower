import type { Editor } from '@tiptap/core'

export const Handlers = {
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
} as const
