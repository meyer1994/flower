import type { CommandProps, NodeViewRenderer } from '@tiptap/core'
import { Extension, Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import JAINode from './JAI.vue'
import JAIChatNode from './JAIChat.vue'
import JAIInputNode from './JAIInput.vue'
import JAudioNode from './JAudio.vue'
import JAudioUploadNode from './JAudioUpload.vue'
import JImageNode from './JImage.vue'
import JImageUploadNode from './JImageUpload.vue'
import JPdfNode from './JPdf.client.vue'
import JPdfUploadNode from './JPdfUpload.vue'
import JPlaceholderNode from './JPlaceholder.vue'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    jImageUpload: {
      insertJImageUpload: () => ReturnType
    }
    jImage: {
      insertJImage: (options: { imageId: string }) => ReturnType
    }
    jAudioUpload: {
      insertJAudioUpload: () => ReturnType
    }
    jAudio: {
      insertJAudio: (options: { audioId: string }) => ReturnType
    }
    jPdfUpload: {
      insertJPdfUpload: () => ReturnType
    }
    jPdf: {
      insertJPdf: (options: { pdfId: string }) => ReturnType
    }
    jPlaceholder: {
      insertJPlaceholder: () => ReturnType
    }
    jAiChat: {
      insertJAiChat: (options: { chatId: string }) => ReturnType
    }
    jAiInput: {
      insertJAiInput: () => ReturnType
    }
    jAi: {
      insertJAi: (options: { aiId: string }) => ReturnType
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

export const JAudioUpload = Node.create({
  name: 'jAudioUpload',
  group: 'block',
  atom: true,
  draggable: true,
  addAttributes() {
    return {}
  },
  parseHTML() {
    return [{ tag: 'div[data-type="j-audio-upload"]' }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'j-audio-upload' })]
  },
  addNodeView(): NodeViewRenderer {
    return VueNodeViewRenderer(JAudioUploadNode)
  },
  addCommands() {
    return {
      insertJAudioUpload: () => ({ commands }: CommandProps) => {
        return commands.insertContent({ type: this.name })
      },
    }
  },
})

export const JAudio = Node.create({
  name: 'jAudio',
  group: 'block',
  atom: true,
  draggable: true,
  addAttributes() {
    return {
      audioId: { default: null as string | null },
    }
  },
  parseHTML() {
    return [{ tag: 'audio[data-type="j-audio"]' }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['audio', mergeAttributes(HTMLAttributes, { 'data-type': 'j-audio' })]
  },
  addNodeView(): NodeViewRenderer {
    return VueNodeViewRenderer(JAudioNode)
  },
  addCommands() {
    return {
      insertJAudio: ({ audioId }: { audioId: string }) => ({ commands }: CommandProps) => {
        return commands.insertContent({ type: this.name, attrs: { audioId } })
      },
    }
  },
})

export const JPdfUpload = Node.create({
  name: 'jPdfUpload',
  group: 'block',
  atom: true,
  draggable: true,
  addAttributes() {
    return {}
  },
  parseHTML() {
    return [{ tag: 'div[data-type="j-pdf-upload"]' }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'j-pdf-upload' })]
  },
  addNodeView(): NodeViewRenderer {
    return VueNodeViewRenderer(JPdfUploadNode)
  },
  addCommands() {
    return {
      insertJPdfUpload: () => ({ commands }: CommandProps) => {
        return commands.insertContent({ type: this.name })
      },
    }
  },
})

export const JPdf = Node.create({
  name: 'jPdf',
  group: 'block',
  atom: true,
  draggable: true,
  addAttributes() {
    return {
      pdfId: { default: null as string | null },
    }
  },
  parseHTML() {
    return [{ tag: 'div[data-type="j-pdf"]' }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'j-pdf' })]
  },
  addNodeView(): NodeViewRenderer {
    return VueNodeViewRenderer(JPdfNode)
  },
  addCommands() {
    return {
      insertJPdf: ({ pdfId }: { pdfId: string }) => ({ commands }: CommandProps) => {
        return commands.insertContent({ type: this.name, attrs: { pdfId } })
      },
    }
  },
})

export const JPlaceholder = Node.create({
  name: 'jPlaceholder',
  group: 'block',
  atom: true,
  draggable: true,
  addAttributes() {
    return {}
  },
  parseHTML() {
    return [{ tag: 'div[data-type="j-placeholder"]' }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'j-placeholder' })]
  },
  addNodeView(): NodeViewRenderer {
    return VueNodeViewRenderer(JPlaceholderNode)
  },
  addCommands() {
    return {
      insertJPlaceholder: () => ({ commands }: CommandProps) => {
        return commands.insertContent({ type: this.name })
      },
    }
  },
})

export const JAiChat = Node.create({
  name: 'jAiChat',
  group: 'block',
  atom: true,
  draggable: true,
  addAttributes() {
    return {
      chatId: { default: null as string | null },
    }
  },
  parseHTML() {
    return [{ tag: 'div[data-type="j-ai-chat"]' }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'j-ai-chat' })]
  },
  addNodeView(): NodeViewRenderer {
    return VueNodeViewRenderer(JAIChatNode)
  },
  addCommands() {
    return {
      insertJAiChat: ({ chatId }: { chatId: string | null }) => ({ commands }: CommandProps) => {
        return commands.insertContent({ type: this.name, attrs: { chatId } })
      },
    }
  },
})

export const JAiInput = Node.create({
  name: 'jAiInput',
  group: 'block',
  atom: true,
  draggable: true,
  addAttributes() {
    return {}
  },
  parseHTML() {
    return [{ tag: 'div[data-type="j-ai-input"]' }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'j-ai-input' })]
  },
  addNodeView(): NodeViewRenderer {
    return VueNodeViewRenderer(JAIInputNode)
  },
  addCommands() {
    return {
      insertJAiInput: () => ({ commands }: CommandProps) => {
        return commands.insertContent({ type: this.name })
      },
    }
  },
})

export const JAi = Node.create({
  name: 'jAi',
  group: 'block',
  atom: true,
  draggable: true,
  addAttributes() {
    return {
      aiId: { default: null as string | null },
    }
  },
  parseHTML() {
    return [{ tag: 'div[data-type="j-ai"]' }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'j-ai' })]
  },
  addNodeView(): NodeViewRenderer {
    return VueNodeViewRenderer(JAINode, { trackNodeViewPosition: true })
  },
  addCommands() {
    return {
      insertJAi: ({ aiId }: { aiId: string }) => ({ commands }: CommandProps) => {
        return commands.insertContent({ type: this.name, attrs: { aiId } })
      },
    }
  },
})

export const JGlobalAttrs = (attrs: Attrs) => Extension.create({
  name: 'jGlobalAttrs',
  addGlobalAttributes() {
    return [{ types: 'nodes', attributes: { id: { default: attrs.id } } }]
  },
})
