<script setup lang="ts">
import type { AuthFormField, ButtonProps } from '@nuxt/ui'
import * as z from 'zod'

const schemaEmail = z.object({
  email: z.email('Invalid email'),
  password: z.string('Password is required').min(8, 'Must be at least 8 characters'),
  remember: z.boolean().optional().default(false),
})

const schemaMagicLink = z.object({
  email: z.email('Invalid email'),
  name: z.string().optional(),
})

const schema = z.union([schemaEmail, schemaMagicLink])

const toast = useToast()
const { client, loggedIn } = useAuth()

const type = ref<'email' | 'magic-link'>('email')

const fieldsEmail: AuthFormField[] = [
  {
    name: 'email',
    label: 'Email',
    type: 'email',
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
    required: false,
  },
]

const fieldsMagicLink: AuthFormField[] = [
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'Enter your email',
    required: true,
  },
  {
    name: 'name',
    label: 'Name',
    type: 'text',
    placeholder: 'Enter your name',
    required: false,
  },
]

const providersDefault: ButtonProps[] = [
  {
    label: 'Google',
    icon: 'i-simple-icons-google',
    class: 'p-2',
    onClick: async () => { toast.add({ title: 'Google', description: 'Sign in with Google' }) },
  },
  {
    label: 'GitHub',
    icon: 'i-simple-icons-github',
    class: 'p-2',
    onClick: async () => { toast.add({ title: 'GitHub', description: 'Sign in with GitHub' }) },
  },
]

const providersEmail: ButtonProps[] = [
  {
    label: 'Magic Link',
    icon: 'i-lucide-sparkles',
    class: 'p-2',
    onClick: async () => { type.value = 'magic-link' },
  },
  ...providersDefault,
]

const providersMagicLink: ButtonProps[] = [
  {
    label: 'Email',
    icon: 'i-lucide-mail',
    class: 'p-2',
    onClick: async () => { type.value = 'email' },
  },
  ...providersDefault,
]

const fields = computed<AuthFormField[]>(() => {
  if (type.value === 'email') return fieldsEmail
  if (type.value === 'magic-link') return fieldsMagicLink
  return []
})

const providers = computed<ButtonProps[]>(() => {
  if (type.value === 'email') return providersEmail
  if (type.value === 'magic-link') return providersMagicLink
  return []
})

const form = useTemplateRef('form')

const onSubmit = async () => {
  const isEmail = schemaEmail.safeParse(form.value?.state)
  const isMagicLink = schemaMagicLink.safeParse(form.value?.state)

  if (isEmail.success) {
    await client.signIn.email({
      email: isEmail.data.email,
      password: isEmail.data.password,
      rememberMe: isEmail.data.remember,
    })
  }

  if (isMagicLink.success) {
    await client.signIn.magicLink({
      name: isMagicLink.data.name,
      email: isMagicLink.data.email,
    })
    toast.add({ title: 'Magic Link', description: 'Check your email for a magic link' })
  }
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <NavHeader />

    <UContainer class="w-full md:w-md">
      <UPageCard v-if="!loggedIn">
        <UAuthForm
          ref="form"
          :schema="schema"
          title="Sign in"
          description="Enter your credentials to access your account."
          icon="i-lucide-user"
          :fields="fields"
          :providers="providers"
          :submit="{
            label: 'Sign in',
            icon: 'i-lucide-log-in',
            onClick: async () => await onSubmit(),
          }"
        />
      </UPageCard>
    </UContainer>
  </div>
</template>
