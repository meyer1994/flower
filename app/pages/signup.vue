<script setup lang="ts">
import type { AuthFormField, FormSubmitEvent } from '@nuxt/ui'
import * as z from 'zod'

const schema = z.object({
  email: z.email('Invalid email'),
  password: z.string('Password is required').min(6, 'Must be at least 6 characters'),
})

type Schema = z.output<typeof schema>

const toast = useToast()
const auth = useAuth()

const fields: AuthFormField[] = [
  {
    name: 'email',
    type: 'email',
    label: 'Email',
    placeholder: 'Enter your email',
    required: true,
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
    required: true,
  },
]

const providers = [
  {
    label: 'Google',
    onClick: () => {
      toast.add({ title: 'Google', description: 'Sign up with Google' })
    },
  },
  {
    label: 'GitHub',
    onClick: () => {
      toast.add({ title: 'GitHub', description: 'Sign up with GitHub' })
    },
  },
]

async function onSubmit(e: FormSubmitEvent<Schema>) {
  await auth.signUp.email({
    email: e.data.email,
    name: e.data.email,
    password: e.data.password,
  })
  await navigateTo('/')
}
</script>

<template>
  <div>
    <UHeader>
      <template #left>
        <UButton
          icon="i-lucide-arrow-left"
          to="/"
        />
      </template>
    </UHeader>

    <div class="flex flex-col items-center justify-center gap-4 p-4">
      <UPageCard>
        <UAuthForm
          :schema="schema"
          title="Sign up"
          description="Enter your credentials to access your account."
          icon="i-lucide-user"
          :fields="fields"
          :providers="providers"
          @submit="onSubmit"
        />
      </UPageCard>
    </div>
  </div>
</template>
