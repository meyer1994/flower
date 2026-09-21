import { Extension } from '@tiptap/core'

export const useEditorKeymap = () => {
  const toast = useToast()

  return Extension.create({
    name: 'editorKeymap',
    addKeyboardShortcuts() {
      return {
        'Mod-Shift-Enter': (args) => {
          console.log(args)
          toast.add({
            title: 'Shortcut pressed',
            description: 'Mod+Shift+Enter',
            color: 'primary',
          })
          return true
        },
      }
    },
  })
}
