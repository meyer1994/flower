<script setup lang="ts">
import type { ButtonProps, PageFeatureProps } from '@nuxt/ui'

const { $auth } = useNuxtApp()
const { data: session } = await $auth.useSession()

const links = computed<ButtonProps[]>(() => {
  const links: ButtonProps[] = []

  links.push({
    label: 'Get started',
    to: '/signin',
    icon: 'i-lucide-square-play',
  })

  if (session.value) links.push({
    label: 'Open dashboard',
    to: '/dash',
    color: 'neutral',
    variant: 'subtle',
    trailingIcon: 'i-lucide-arrow-right',
  })

  return links
})

const features: PageFeatureProps[] = [
  {
    title: 'Auth built in',
    description: 'Sign up and sign in with email and password, powered by Better Auth.',
    icon: 'i-lucide-shield-check',
  },
  {
    title: 'Dashboard ready',
    description: 'A collapsible sidebar layout so you can grow the app without redesigning navigation.',
    icon: 'i-lucide-layout-dashboard',
  },
  {
    title: 'File storage',
    description: 'Upload and manage files through tRPC with S3-compatible storage.',
    icon: 'i-lucide-hard-drive',
  },
]

const ctaLinks = computed<ButtonProps[]>(() => {
  const links: ButtonProps[] = []

  if (!session.value) links.push({
    label: 'Create an account',
    to: '/signin',
  })

  links.push({
    label: 'Open dashboard',
    to: '/dash',
    color: 'neutral',
    variant: 'subtle',
    trailingIcon: 'i-lucide-arrow-right',
  })

  return links
})
</script>

<template>
  <div>
    <UPageHero
      headline="bruch"
      title="Build faster with a solid foundation"
      description="A Nuxt starter with auth, a dashboard shell, and file storage — ready for your next product."
      :links="links"
    />

    <UPageSection
      headline="Features"
      title="Everything you need to start"
      description="Core pieces wired up so you can focus on your product instead of boilerplate."
      :features="features"
    />

    <UPageSection>
      <UPageCTA
        title="Ready when you are"
        description="Create an account and jump into the dashboard."
        variant="subtle"
        :links="ctaLinks"
      />
    </UPageSection>
  </div>
</template>
