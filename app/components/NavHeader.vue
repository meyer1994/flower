<script setup lang="ts">
import type {
  NavigationMenuItem,
} from '@nuxt/ui'

const { loggedIn } = useAuth()

const route = useRoute()
const getOpen = (i: NavigationMenuItem) => i.to === route.path

const items = computed(() => {
  if (loggedIn.value) {
    return [
      {
        // to: '/',
        label: 'Files',
        icon: 'i-lucide-folder',
        open: getOpen({ to: '/' }),
      },
      // {
      //   onClick: async () => {
      //     await signOut()
      //     await navigateTo('/signin')
      //   },
      //   label: 'Sign Out',
      //   icon: 'i-lucide-log-out',
      // },
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
    <template #title>
      Flower
    </template>
    <template #right>
      <UNavigationMenu :items="items" />
    </template>
  </UHeader>
</template>
