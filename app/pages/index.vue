<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const auth = useAuth()
const session = await auth.fetchSession()

const items: NavigationMenuItem[] = []

if (session) {
  items.push({
    label: 'Sign Out',
    onClick: async () => {
      await auth.signOut()
      await reloadNuxtApp() // force page reload
    },
  })
}

if (!session) {
  items.push({ label: 'Sign In', to: '/signin' })
  items.push({ label: 'Sign Up', to: '/signup' })
}
</script>

<template>
  <div>
    <UHeader>
      <template #right>
        <UNavigationMenu :items="items" />
      </template>
    </UHeader>

    <div class="flex flex-col items-center justify-center gap-4 p-4">
      <template v-if="session">
        <PageDemo />
      </template>

      <template v-else>
        <UPageCard title="Welcome to the app">
          You are not logged in. Please sign in to continue.
        </UPageCard>
      </template>
    </div>
  </div>
</template>
