<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()
const { loggedIn, signOut } = useAuth()

const items = computed<NavigationMenuItem[]>(() => {
  if (loggedIn.value) {
    return [
      {
        to: '/demo',
        label: 'Demo',
        icon: 'i-lucide-play',
        open: route.path.startsWith('/demo'),
      },
      {
        to: '/profile',
        label: 'Profile',
        icon: 'i-lucide-user',
        open: route.path.startsWith('/profile'),
      },
    ]
  }

  return [
    {
      to: '/signin',
      label: 'Sign In',
      icon: 'i-lucide-log-in',
      open: route.path.startsWith('/signin'),
    },
    {
      to: '/signup',
      label: 'Sign Up',
      icon: 'i-lucide-user-plus',
      open: route.path.startsWith('/signup'),
    },
  ]
})
</script>

<template>
  <UHeader>
    <template #title>
      <UButton
        label="flower"
        variant="ghost"
        class="text-2xl font-bold"
        icon="i-lucide-flower"
        @click="async () => { await navigateTo('/') }"
      />
    </template>

    <UNavigationMenu :items="items" />

    <template #right>
      <UColorModeButton title="Toggle Color Mode" />
      <template v-if="loggedIn">
        <UButton
          icon="i-lucide-log-out"
          title="Sign Out"
          variant="ghost"
          color="neutral"
          @click="async () => {
            await signOut();
            await reloadNuxtApp({ path: '/' })
          }"
        />
      </template>
    </template>

    <template #body>
      <UNavigationMenu
        :items="items"
        orientation="vertical"
      />
    </template>
  </UHeader>
</template>
