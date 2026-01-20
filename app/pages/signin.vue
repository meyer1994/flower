<script setup lang="ts">
import type { AuthFormField, FormSubmitEvent } from '@nuxt/ui'
import * as z from 'zod'

const schema = z.object({
  email: z.email('Invalid email'),
  password: z.string('Password is required').min(8, 'Must be at least 8 characters'),
  remember: z.boolean().optional(),
})

type Schema = z.output<typeof schema>

const toast = useToast()

const auth = useAuth()
const session = await auth.fetchSession()
if (session) await navigateTo('/')

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
  {
    name: 'remember',
    label: 'Remember me',
    type: 'checkbox',
  },
]

const providers = [
  {
    label: 'Google',
    onClick: () => {
      toast.add({ title: 'Google', description: 'Login with Google' })
    },
  },
  {
    label: 'GitHub',
    onClick: () => {
      toast.add({ title: 'GitHub', description: 'Login with GitHub' })
    },
  },
]

async function onSubmit(event: FormSubmitEvent<Schema>) {
  await auth.signIn.email({
    email: event.data.email,
    password: event.data.password,
    callbackURL: '/',
  })
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
      <UPageCard class="w-full max-w-md">
        <UAuthForm
          :schema="schema"
          title="Sign in"
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
