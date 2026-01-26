<script setup lang="ts">
import type { DropdownMenuItem, NavigationMenuItem } from '@nuxt/ui'

definePageMeta({ auth: true })

const { user, signOut } = useAuth()

const profileItems: DropdownMenuItem[][] = [
  [
    {
      label: 'Profile',
      icon: 'i-lucide-user',
      to: '/profile',
    },
    {
      label: 'Settings',
      icon: 'i-lucide-settings',
      to: '/settings',
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

const items: NavigationMenuItem[] = [
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
</script>

<template>
  <UDashboardGroup>
    <UDashboardSidebar
      collapsible
      :ui="{ footer: 'border-t border-default' }"
    >
      <template #header="{ collapsed }">
        <ULink
          to="/"
          :class="{
            'mx-auto': collapsed,
            'flex items-center gap-2': true,
          }"
        >
          <UIcon
            name="i-lucide-flower"
            class="size-5 text-primary"
          />
          <span
            v-if="!collapsed"
            class="size-5 font-semibold"
          >
            flower
          </span>
        </ULink>
      </template>

      <template #default="{ collapsed }">
        <UNavigationMenu
          :collapsed="collapsed"
          :items="items"
          orientation="vertical"
        />
      </template>

      <template #footer="{ collapsed }">
        <UDropdownMenu
          :items="profileItems"
          class="w-full"
          icon="i-lucide-user"
          :ui="{
            content: 'w-(--reka-dropdown-menu-trigger-width)',
          }"
        >
          <UButton
            icon="i-lucide-user"
            :label="collapsed ? undefined : user?.name ?? 'Profile'"
            color="neutral"
            variant="ghost"
            class="w-full"
            :block="collapsed"
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
