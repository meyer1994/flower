<script setup lang="ts">
const auth = useAuth()
const toast = useToast()

// Redirect to signin if not logged in
if (!auth.loggedIn.value) {
  await navigateTo('/signin')
}

// Fetch full session data including user
const { data: sessionData, refresh } = await useAsyncData('profile-session', async () => {
  const result = await auth.client.getSession()
  return result.data
})

const user = computed(() => sessionData.value?.user)

async function onSignOut() {
  await auth.signOut({ redirectTo: '/' })
}

async function onUpdateName() {
  const newName = prompt('Enter new name:', user.value?.name || '')
  if (!newName || newName === user.value?.name) return

  const { error } = await auth.client.updateUser({ name: newName })
  if (error) {
    toast.add({ title: 'Error', description: error.message, color: 'error' })
    return
  }

  toast.add({ title: 'Success', description: 'Name updated successfully', color: 'success' })
  await refresh()
}
</script>

<template>
  <div>
    <UHeader>
      <template #left>
        <UButton
          icon="i-lucide-arrow-left"
          to="/"
        />
      </template>
    </UHeader>

    <div class="flex flex-col items-center justify-center gap-4 p-4">
      <UPageCard
        v-if="user"
        class="w-full max-w-md"
      >
        <div class="flex flex-col items-center gap-6 p-4">
          <UAvatar
            :src="user.image || undefined"
            :alt="user.name"
            size="3xl"
            icon="i-lucide-user"
          />

          <div class="text-center">
            <h1 class="text-2xl font-bold">
              {{ user.name }}
            </h1>
            <p class="text-muted">
              {{ user.email }}
            </p>
          </div>

          <div class="w-full space-y-4">
            <div class="flex items-center justify-between rounded-lg bg-elevated p-3">
              <div class="flex items-center gap-2">
                <UIcon
                  name="i-lucide-mail"
                  class="text-muted"
                />
                <span class="text-sm text-muted">Email verified</span>
              </div>
              <UBadge
                :color="user.emailVerified ? 'success' : 'warning'"
                variant="subtle"
              >
                {{ user.emailVerified ? 'Verified' : 'Not verified' }}
              </UBadge>
            </div>

            <div class="flex items-center justify-between rounded-lg bg-elevated p-3">
              <div class="flex items-center gap-2">
                <UIcon
                  name="i-lucide-calendar"
                  class="text-muted"
                />
                <span class="text-sm text-muted">Member since</span>
              </div>
              <span class="text-sm">
                {{ new Date(user.createdAt).toLocaleDateString() }}
              </span>
            </div>
          </div>

          <div class="flex w-full flex-col gap-2">
            <UButton
              block
              variant="soft"
              icon="i-lucide-pencil"
              @click="onUpdateName"
            >
              Edit Name
            </UButton>
            <UButton
              block
              color="error"
              variant="soft"
              icon="i-lucide-log-out"
              @click="onSignOut"
            >
              Sign Out
            </UButton>
          </div>
        </div>
      </UPageCard>

      <UPageCard
        v-else
        class="w-full max-w-md"
        title="Not logged in"
        description="Please sign in to view your profile."
      >
        <UButton
          to="/signin"
          icon="i-lucide-log-in"
        >
          Sign In
        </UButton>
      </UPageCard>
    </div>
  </div>
</template>
