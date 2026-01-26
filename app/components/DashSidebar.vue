<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const { user, signOut } = useAuth()

const sidebarItems: NavigationMenuItem[] = [
  [
    {
      label: 'Demo',
      icon: 'i-lucide-flask-conical',
      to: '/dash/demo',
    },
    {
      label: 'API Keys',
      icon: 'i-lucide-key',
      to: '/dash/keys',
    },
    {
      label: 'Playground',
      icon: 'i-lucide-terminal',
      to: '/dash/playground',
    },
  ],
]

const userMenuItems: NavigationMenuItem[] = [
  [
    {
      label: 'Profile',
      icon: 'i-lucide-user',
      to: '/dash/profile',
    },
  ],
  [
    {
      label: 'Sign out',
      icon: 'i-lucide-log-out',
      click: signOut,
    },
  ],
]
</script>

<template>
  <UDashboardSidebar
    collapsible
    open
    :toggle="{
      color: 'primary',
      variant: 'subtle',
      class: 'rounded-full',
    }"
  >
    <template #header="{ collapsed }">
      <template v-if="!collapsed">
        <UIcon
          name="i-lucide-flower"
          class="text-primary"
        />
        <span class="font-semibold">flower</span>
      </template>

      <template v-else>
        <UDashboardSidebarToggle />
      </template>
    </template>

    <template #toggle>
      <UDashboardSidebarToggle />
    </template>

    <template #default="{ collapsed }">
      <UNavigationMenu
        :collapsed="collapsed"
        :items="sidebarItems"
        orientation="vertical"
      />
    </template>

    <template #footer="{ collapsed }">
      banana
    </template>
  </UDashboardSidebar>
</template>
