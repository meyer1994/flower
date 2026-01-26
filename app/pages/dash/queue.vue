<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const { $trpc } = useNuxtApp()
const toast = useToast()

const schema = z.object({
  message: z.string().min(1, 'Message is required'),
})

type Schema = z.output<typeof schema>
const state = reactive<Partial<Schema>>({ message: '' })

const loading = ref(false)
const history = ref<Array<{ id: string, message: string, timestamp: string, success: boolean }>>([])

async function onSubmit(event: FormSubmitEvent<Schema>) {
  loading.value = true

  try {
    const result = await $trpc.queue.send.mutate({ message: event.data.message })

    history.value.unshift({
      id: crypto.randomUUID(),
      message: result.payload.message,
      timestamp: result.payload.timestamp,
      success: result.success,
    })

    state.message = ''
    toast.add({ title: 'Message sent', description: 'Message added to queue', color: 'success' })
  }
  catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    toast.add({ title: 'Error', description: errorMessage, color: 'error' })
  }
  finally {
    loading.value = false
  }
}

function clearHistory() {
  history.value = []
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <UCard>
      <template #header>
        <div>
          <h1 class="text-xl font-semibold">
            Queue
          </h1>
          <p class="text-sm text-muted mt-1">
            Send messages to Cloudflare Queue
          </p>
        </div>
      </template>

      <UForm
        :schema="schema"
        :state="state"
        class="flex flex-col gap-4"
        @submit="onSubmit"
      >
        <UFormField
          name="message"
          label="Message"
          description="Enter the message to send to the queue"
        >
          <UTextarea
            v-model="state.message"
            placeholder="Enter your message..."
            :rows="4"
            class="w-full"
          />
        </UFormField>

        <div class="flex gap-2">
          <UButton
            type="submit"
            :loading="loading"
            icon="i-lucide-send"
          >
            Send to Queue
          </UButton>
        </div>
      </UForm>
    </UCard>

    <!-- History -->
    <UCard v-if="history.length > 0">
      <template #header>
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-lg font-semibold">
              Sent Messages
            </h2>
            <p class="text-sm text-muted mt-1">
              History of messages sent to the queue
            </p>
          </div>
          <UButton
            variant="ghost"
            color="neutral"
            icon="i-lucide-trash-2"
            size="sm"
            @click="clearHistory"
          >
            Clear
          </UButton>
        </div>
      </template>

      <div class="flex flex-col gap-3">
        <div
          v-for="item in history"
          :key="item.id"
          class="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
        >
          <UIcon
            :name="item.success ? 'i-lucide-check-circle' : 'i-lucide-x-circle'"
            :class="item.success ? 'text-success' : 'text-error'"
            class="size-5 mt-0.5 shrink-0"
          />
          <div class="flex-1 min-w-0">
            <p class="text-sm wrap-break-word">
              {{ item.message }}
            </p>
            <p class="text-xs text-muted mt-1">
              {{ new Date(item.timestamp).toLocaleString() }}
            </p>
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>
