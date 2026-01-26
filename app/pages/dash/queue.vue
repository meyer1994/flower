<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import * as z from 'zod'

const { $trpc } = useNuxtApp()
const toast = useToast()

// Fetch tasks from database
const { data: tasks, refresh } = await useAsyncData(
  'tasks',
  () => $trpc.queue.list.query(),
)

const schema = z.object({
  message: z.string().min(1, 'Message is required'),
})

type Schema = z.output<typeof schema>
const state = reactive<Partial<Schema>>({ message: '' })

const loading = ref(false)

async function onSubmit(event: FormSubmitEvent<Schema>) {
  loading.value = true

  try {
    await $trpc.queue.send.mutate({ message: event.data.message })
    state.message = ''
    toast.add({ title: 'Task created', description: 'Task added to queue', color: 'success' })
    await refresh()
  }
  catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    toast.add({ title: 'Error', description: errorMessage, color: 'error' })
  }
  finally {
    loading.value = false
  }
}

const statusConfig = {
  PENDING: { icon: 'i-lucide-clock', color: 'text-muted', label: 'Pending' },
  SENDING: { icon: 'i-lucide-loader', color: 'text-info', label: 'Sending' },
  RUNNING: { icon: 'i-lucide-loader', color: 'text-info', label: 'Running' },
  ERRORED: { icon: 'i-lucide-x-circle', color: 'text-error', label: 'Errored' },
  FINISHED: { icon: 'i-lucide-check-circle', color: 'text-success', label: 'Finished' },
} as const
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

    <!-- Tasks -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-lg font-semibold">
              Tasks
            </h2>
            <p class="text-sm text-muted mt-1">
              Queue tasks and their status
            </p>
          </div>
          <UButton
            variant="ghost"
            color="neutral"
            icon="i-lucide-refresh-cw"
            size="sm"
            @click="refresh()"
          >
            Refresh
          </UButton>
        </div>
      </template>

      <div
        v-if="tasks && tasks.length > 0"
        class="flex flex-col gap-3"
      >
        <div
          v-for="task in tasks"
          :key="task.id"
          class="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
        >
          <UIcon
            :name="statusConfig[task.status].icon"
            :class="[statusConfig[task.status].color, task.status === 'RUNNING' && 'animate-spin']"
            class="size-5 mt-0.5 shrink-0"
          />
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <UBadge
                :color="task.status === 'FINISHED' ? 'success' : task.status === 'ERRORED' ? 'error' : task.status === 'RUNNING' ? 'info' : 'neutral'"
                variant="subtle"
                size="xs"
              >
                {{ statusConfig[task.status].label }}
              </UBadge>
              <span class="text-xs text-muted font-mono">{{ task.id.slice(0, 8) }}</span>
            </div>
            <p class="text-sm wrap-break-word">
              {{ task.message }}
            </p>
            <p
              v-if="task.error"
              class="text-xs text-error mt-1"
            >
              Error: {{ task.error }}
            </p>
            <p class="text-xs text-muted mt-1">
              {{ new Date(task.createdAt).toLocaleString() }}
            </p>
          </div>
        </div>
      </div>

      <div
        v-else
        class="text-center py-8 text-muted"
      >
        <UIcon
          name="i-lucide-inbox"
          class="size-12 mx-auto mb-2 opacity-50"
        />
        <p>No tasks yet</p>
        <p class="text-sm">
          Send a message to create your first task
        </p>
      </div>
    </UCard>
  </div>
</template>
