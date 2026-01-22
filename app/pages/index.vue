<script setup lang="ts">
const { loggedIn } = useAuth()
</script>

<template>
  <div class="flex flex-col gap-4">
    <NavHeader />

    <UContainer class="w-md">
      <UPageCard
        v-if="loggedIn"
        title="Welcome to the app"
      >
        <UButton
          to="/demo"
          icon="i-lucide-play"
        >
          Demo
        </UButton>
      </UPageCard>

      <UPageCard
        v-else
        title="Not logged in"
      >
        Please sign in to continue.
        <UButton
          to="/signin"
          icon="i-lucide-log-in"
        >
          Sign In
        </UButton>
      </UPageCard>
    </UContainer>
  </div>
</template>
