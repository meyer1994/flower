<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

const { loggedIn, user, signOut } = useAuth()

const profileItems: DropdownMenuItem[][] = [
  [
    {
      label: 'Profile',
      icon: 'i-lucide-user',
      to: '/profile',
    },
  ],
  [
    {
      label: 'Sign out',
      icon: 'i-lucide-log-out',
      onSelect: async () => {
        await signOut()
        await reloadNuxtApp({ path: '/' })
      },
    },
  ],
]
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

    <template #right>
      <UColorModeButton title="Toggle Color Mode" />

      <template v-if="loggedIn">
        <UButton
          icon="i-lucide-layout-dashboard"
          title="Dashboard"
          variant="ghost"
          color="neutral"
          to="/dash"
        />

        <UDropdownMenu
          :items="profileItems"
          :ui="{ content: 'w-(--reka-dropdown-menu-trigger-width)' }"
        >
          <UButton
            icon="i-lucide-user"
            :label="user?.name ?? 'Profile'"
            color="neutral"
            variant="ghost"
          />
        </UDropdownMenu>
      </template>

      <template v-else>
        <UButton
          to="/signin"
          label="Sign In"
          variant="ghost"
          color="neutral"
        />
        <UButton
          to="/signup"
          label="Sign Up"
          color="primary"
        />
      </template>
    </template>

    <template #body>
      <div class="flex flex-col gap-2 p-4">
        <template v-if="loggedIn">
          <UButton
            to="/dash"
            label="Dashboard"
            icon="i-lucide-layout-dashboard"
            variant="ghost"
            color="neutral"
            block
          />
          <UButton
            to="/profile"
            label="Profile"
            icon="i-lucide-user"
            variant="ghost"
            color="neutral"
            block
          />
        </template>
        <template v-else>
          <UButton
            to="/signin"
            label="Sign In"
            icon="i-lucide-log-in"
            variant="ghost"
            color="neutral"
            block
          />
          <UButton
            to="/signup"
            label="Sign Up"
            icon="i-lucide-user-plus"
            color="primary"
            block
          />
        </template>
      </div>
    </template>
  </UHeader>
</template>
