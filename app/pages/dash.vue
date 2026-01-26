<script setup lang="ts">
import type { DropdownMenuItem, NavigationMenuItem } from '@nuxt/ui'

definePageMeta({ auth: true })

const { user, signOut } = useAuth()
const route = useRoute()

const profileItems: DropdownMenuItem[][] = [
  [
    {
      label: 'Profile',
      icon: 'i-lucide-user',
      to: '/dash/profile',
    },
    {
      label: 'Settings',
      icon: 'i-lucide-settings',
      to: '/dash/settings',
    },
  ],
  [
    {
      label: 'Sign out',
      icon: 'i-lucide-log-out',
      onSelect: signOut,
    },
  ],
]

const itemsDemo: NavigationMenuItem[] = [
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
]
</script>

<template>
  <UDashboardGroup>
    <UDashboardSidebar
      collapsible
      :ui="{ footer: 'border-t border-default' }"
    >
      <template #header="{ collapsed }">
        <NuxtLink
          to="/dash"
          class="font-semibold flex items-center gap-2"
          :block="collapsed"
        >
          <UIcon
            name="i-lucide-flower"
            class="size-6 text-primary"
          />
          <template v-if="!collapsed">
            flower
          </template>
        </NuxtLink>
      </template>

      <template #default="{ collapsed }">
        <UNavigationMenu
          :block="collapsed"
          :collapsed="collapsed"
          :items="itemsDemo"
          orientation="vertical"
        />
      </template>

      <template #footer="{ collapsed }">
        <UDropdownMenu
          :items="profileItems"
          class="w-full"
          icon="i-lucide-user"
          :ui="{ content: 'w-(--reka-dropdown-menu-trigger-width)' }"
          :block="collapsed"
        >
          <UButton
            icon="i-lucide-user"
            :label="collapsed ? undefined : user?.name ?? 'Profile'"
            color="neutral"
            variant="ghost"
            class="w-full"
            aria-label="Profile menu"
          />
        </UDropdownMenu>
      </template>
    </UDashboardSidebar>

    <UDashboardPanel>
      <template #header>
        <UDashboardNavbar title="Dashboard">
          <template #leading>
            <UDashboardSidebarCollapse />
          </template>
        </UDashboardNavbar>
      </template>

      <template #body>
        <NuxtPage />
      </template>
    </UDashboardPanel>
  </UDashboardGroup>
</template>
