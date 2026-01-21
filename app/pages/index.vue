<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const { loggedIn, signOut } = useAuth()

const items = computed<NavigationMenuItem[]>(() => {
  if (loggedIn.value) {
    return [
      { label: 'Home', to: '/', icon: 'i-lucide-home' },
      { label: 'Profile', to: '/profile', icon: 'i-lucide-user' },
      { label: 'Sign Out', onClick: onSignOut, icon: 'i-lucide-log-out' },
    ]
  }

  return [
    { label: 'Sign In', to: '/signin', icon: 'i-lucide-log-in' },
    { label: 'Sign Up', to: '/signup', icon: 'i-lucide-user-plus' },
  ]
})

async function onSignOut() {
  await signOut()
  await reloadNuxtApp({ path: '/' })
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
      <template v-if="loggedIn">
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
