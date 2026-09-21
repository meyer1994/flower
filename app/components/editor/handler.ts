import type { Editor } from '@tiptap/core'

export const Handlers = {
  imageUpload: {
    canExecute: (editor: Editor) => editor.can().insertContent({ type: 'jImageUpload' }),
    execute: (editor: Editor) => editor.chain().focus().insertContent({ type: 'jImageUpload' }),
    isActive: (editor: Editor) => editor.isActive('jImageUpload'),
    isDisabled: undefined,
  },
} as const
