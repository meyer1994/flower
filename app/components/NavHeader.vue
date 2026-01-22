<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const { loggedIn, signOut } = useAuth()

const route = useRoute()
const getOpen = (i: NavigationMenuItem) => i.to === route.path

const items = computed(() => {
  if (loggedIn.value) {
    return [
      {
        to: '/demo',
        label: 'Demo',
        icon: 'i-lucide-play',
        open: getOpen({ to: '/demo' }),
      },
      {
        to: '/profile',
        label: 'Profile',
        icon: 'i-lucide-user',
        open: getOpen({ to: '/profile' }),
      },
      {
        onClick: async () => {
          await signOut()
          await reloadNuxtApp({ path: '/' })
        },
        label: 'Sign Out',
        icon: 'i-lucide-log-out',
        open: getOpen({ to: '/signout' }),
      },
    ]
  }

  return [
    {
      to: '/signin',
      label: 'Sign In',
      icon: 'i-lucide-log-in',
      open: getOpen({ to: '/signin' }),
    },
    {
      to: '/signup',
      label: 'Sign Up',
      icon: 'i-lucide-user-plus',
      open: getOpen({ to: '/signup' }),
    },
  ]
})
</script>

<template>
  <UHeader>
    <template #right>
      <UNavigationMenu :items="items" />
    </template>
  </UHeader>
</template>
