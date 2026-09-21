import type { CommandProps, NodeViewRenderer } from '@tiptap/core'
import { Extension, Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import JImageNode from './JImage.vue'
import JImageUploadNode from './JImageUpload.vue'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    jImageUpload: {
      insertJImageUpload: () => ReturnType
    }
    jImage: {
      insertJImage: (options: { imageId: string }) => ReturnType
    }
  }
}

export const JImageUpload = Node.create({
  name: 'jImageUpload',
  group: 'block',
  atom: true,
  draggable: true,
  addAttributes() {
    return {}
  },
  parseHTML() {
    return [{ tag: 'div[data-type="j-image-upload"]' }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'j-image-upload' })]
  },
  addNodeView(): NodeViewRenderer {
    return VueNodeViewRenderer(JImageUploadNode)
  },
  addCommands() {
    return {
      insertJImageUpload: () => ({ commands }: CommandProps) => {
        return commands.insertContent({ type: this.name })
      },
    }
  },
})

export const JImage = Node.create({
  name: 'jImage',
  group: 'block',
  atom: true,
  draggable: true,
  addAttributes() {
    return {
      imageId: { default: null as string | null },
    }
  },
  parseHTML() {
    return [{ tag: 'img[data-type="j-image"]' }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['img', mergeAttributes(HTMLAttributes, { 'data-type': 'j-image' })]
  },
  addNodeView(): NodeViewRenderer {
    return VueNodeViewRenderer(JImageNode)
  },
  addCommands() {
    return {
      insertJImage: ({ imageId }: { imageId: string }) => ({ commands }: CommandProps) => {
        return commands.insertContent({ type: this.name, attrs: { imageId } })
      },
    }
  },
})

type Attrs = {
  id: string
}

export const JGlobalAttrs = (attrs: Attrs) => Extension.create({
  name: 'jGlobalAttrs',
  addGlobalAttributes() {
    return [{ types: 'nodes', attributes: { id: { default: attrs.id } } }]
  },
})
