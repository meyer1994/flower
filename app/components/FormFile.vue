<script setup lang="ts">
import * as z from 'zod'

const schema = z.object({
  file: z.instanceof(File, { message: 'Please select a file' }),
})

type Schema = z.output<typeof schema>
type Props = { defaultValue?: Partial<Schema> }
export type FormFileData = Schema

const props = withDefaults(defineProps<Props>(), { defaultValue: () => ({}) })
const state = reactive<Partial<Schema>>({ file: props.defaultValue?.file })
watch(() => props.defaultValue, v => v && Object.assign(state, v))

const emits = defineEmits<{ submit: [e: Schema] }>()
</script>

<template>
  <UForm
    :schema="schema"
    :state="state"
    class="flex flex-col gap-4"
    @submit.prevent="(e) => emits('submit', e.data)"
  >
    <UFormField
      name="file"
      label="Arquivo"
      description="Selecione um arquivo para enviar"
    >
      <UFileUpload
        v-model="state.file"
        class="w-full"
      />
    </UFormField>

    <div class="flex gap-2 justify-between items-center mt-4">
      <slot name="submit-button">
        <UButton type="submit">
          Enviar
        </UButton>
      </slot>
    </div>
  </UForm>
</template>
