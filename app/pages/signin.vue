<script setup lang="ts">
import type { AuthFormField, ButtonProps, FormSubmitEvent, TabsItem } from '@nuxt/ui'
import * as z from 'zod'

const { $auth } = useNuxtApp()
const toast = useToast()

const schema = z.object({ email: z.email(), password: z.string() })

async function onSignIn(e: FormSubmitEvent<z.output<typeof schema>>) {
  try {
    const { error } = await $auth.signIn.email({
      email: e.data.email,
      password: e.data.password,
    })

    if (error) {
      toast.add({ title: 'Erro', description: error.message, color: 'error' })
      return
    }

    await reloadNuxtApp({ path: '/profile' })
  }
  catch {
    toast.add({ title: 'Erro', description: 'Falha ao entrar', color: 'error' })
  }
}

async function onSignUp(e: FormSubmitEvent<z.output<typeof schema>>) {
  try {
    const { error } = await $auth.signUp.email({
      email: e.data.email,
      password: e.data.password,
      name: e.data.email,
      callbackURL: '/profile',
    })

    if (error) {
      console.error(error)
      toast.add({ title: 'Erro', description: error.message, color: 'error' })
      return
    }

    await reloadNuxtApp({ path: '/profile' })
  }
  catch (error) {
    console.error(error)
    toast.add({ title: 'Erro', description: String(error), color: 'error' })
  }
}
</script>

<template>
  <div class="flex flex-col lg:flex-row min-h-screen">
    <!-- Left branding panel -->
    <div class="hidden lg:flex lg:w-1/2 bg-gray-950 p-12 flex-col justify-between">
      <div>
        <div class="flex items-center gap-2 mb-12">
          <UIcon
            name="i-lucide-flower"
            class="text-3xl text-primary"
          />
          <span class="text-2xl font-bold text-white">trackows</span>
        </div>
        <h1 class="text-5xl font-bold text-white mb-4">
          Acompanhe seus
          <br>
          <span class="text-primary">Dispositivos</span>
        </h1>
        <p class="text-gray-400 text-lg">
          Rastreamento GPS e telemetria em tempo real para seus dispositivos conectados.
        </p>
      </div>

      <div>
        <div class="flex items-center gap-2 text-sm">
          <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span class="text-gray-300">Sistema online</span>
        </div>
      </div>
    </div>

    <!-- Right form panel -->
    <div class="flex-1 flex items-center justify-center p-6">
      <div class="w-full max-w-md">
        <UTabs
          variant="link"
          :default-value="$route.query.page === 'signup' ? 'signup' : 'signin'"
          class="w-full gap-4"
          :ui="{ trigger: 'grow' }"
          :items="([
            { label: 'Entrar', icon: 'i-lucide-log-in', value: 'signin', slot: 'signin' as const },
            { label: 'Criar conta', icon: 'i-lucide-user-plus', value: 'signup', slot: 'signup' as const },
          ] satisfies TabsItem[])"
          @update:model-value="navigateTo({ query: { ...$route.query, page: $event } })"
        >
          <!-- Sign in tab -->
          <template #signin>
            <UAuthForm
              :schema="schema"
              title="Bem-vindo de volta"
              description="Digite suas credenciais para acessar."
              icon="i-lucide-lock"
              :fields="([
                {
                  name: 'email',
                  label: 'Email',
                  type: 'email',
                  placeholder: 'Digite seu email',
                  required: true,
                },
                {
                  name: 'password',
                  label: 'Senha',
                  type: 'password',
                  placeholder: 'Digite sua senha',
                  required: true,
                },
              ] as AuthFormField[])"
              :providers="([
                {
                  label: 'GitHub (em breve)',
                  icon: 'i-simple-icons-github',
                  class: 'p-2',
                  onClick: async () => { toast.add({ title: 'GitHub', description: 'Sign in with GitHub' }) },
                },
                {
                  label: 'Google (em breve)',
                  icon: 'i-simple-icons-google',
                  class: 'p-2',
                  onClick: async () => { toast.add({ title: 'Google', description: 'Sign in with Google' }) },
                },
              ] as ButtonProps[])"
              @submit.prevent="onSignIn"
            >
              <template #separator>
                <USeparator label="ou" />
              </template>
            </UAuthForm>
          </template>

          <!-- Sign up tab -->
          <template #signup>
            <UAuthForm
              :schema="schema"
              title="Create account"
              description="Create an account to start tracking your devices."
              icon="i-lucide-user-plus"
              :fields="([
                {
                  name: 'email',
                  label: 'Email',
                  type: 'email',
                  placeholder: 'Type your email',
                  required: true,
                },
                {
                  name: 'password',
                  label: 'Password',
                  type: 'password',
                  placeholder: 'Choose a password',
                  required: true,
                },
              ] as AuthFormField[])"
              :providers="([
                {
                  label: 'GitHub (em breve)',
                  icon: 'i-simple-icons-github',
                  class: 'p-2',
                  onClick: async () => { toast.add({ title: 'GitHub', description: 'Sign in with GitHub' }) },
                },
                {
                  label: 'Google (em breve)',
                  icon: 'i-simple-icons-google',
                  class: 'p-2',
                  onClick: async () => { toast.add({ title: 'Google', description: 'Sign in with Google' }) },
                },
              ] as ButtonProps[])"
              @submit.prevent="onSignUp"
            >
              <template #separator>
                <USeparator label="ou" />
              </template>
            </UAuthForm>
          </template>
        </UTabs>
      </div>
    </div>
  </div>
</template>
