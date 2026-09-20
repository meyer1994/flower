<script setup lang="ts">
import type { DropdownMenuItem, NavigationMenuItem } from '@nuxt/ui'

const { $auth } = useNuxtApp()
const { data: session, error } = await $auth.useSession()
if (error.value) throw createError(error.value)

const navMenu = computed<NavigationMenuItem[]>(() => {
  return [
    { label: 'Counter', icon: 'i-lucide-plus', to: '/dash/counter' },
    { label: 'Files', icon: 'i-lucide-files', to: '/dash/files' },
  ]
})
</script>

<template>
  <UDashboardGroup>
    <UDashboardSidebar
      collapsible
      :ui="{ root: 'pb-8' }"
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
            bruch
          </template>
        </NuxtLink>
      </template>

      <template #default="{ collapsed }">
        <UNavigationMenu
          :block="collapsed"
          :collapsed="collapsed"
          :items="navMenu"
          orientation="vertical"
        />
      </template>

      <template #footer>
        <UDropdownMenu
          :items="([
            {
              label: 'Perfil',
              icon: 'i-lucide-user',
              to: '/profile',
            },
            {
              label: 'Sair',
              icon: 'i-lucide-log-out',
              onSelect: async () => {
                await $auth.client.signOut()
                await reloadNuxtApp({ path: '/' })
              },
            },
          ] satisfies DropdownMenuItem[])"
          class="w-full"
          size="lg"
          :content="{ side: 'top', align: 'start' }"
          :ui="{ content: 'w-64' }"
        >
          <UButton
            icon="i-lucide-user"
            :label="session?.user.name ?? 'NA'"
            class="w-full flex items-center"
            color="neutral"
            variant="ghost"
          >
            <template #trailing>
              <UIcon
                name="i-lucide-chevron-up"
                class="ml-auto"
              />
            </template>
          </UButton>
        </UDropdownMenu>
      </template>
    </UDashboardSidebar>

    <UDashboardPanel>
      <template #header>
        <UDashboardNavbar title="Painel">
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
