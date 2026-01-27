<script setup lang="ts">
definePageMeta({ auth: true })

const url = useRequestURL()
const { user, client: auth } = useAuth()
</script>

<template>
  <UCard>
    <template #header>
      <h2 class="text-2xl font-bold">
        Choose Your Plan
      </h2>
    </template>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <UPricingPlan
        :title="'Starter'"
        :price="'$0/mo'"
        description="Get started with Flower. 20MB free uploads, fast AI search, and cloud sync."
        :features="[
          '20MB total uploads',
          'AI-powered search',
          'Cloud storage',
          'Community support',
        ]"
        :button="{
          label: 'Current Plan',
          color: 'neutral',
          onClick: async () => {
            const { data, error } = await auth.subscription.upgrade({
              plan: 'starter',
              referenceId: user?.id,
              cancelUrl: url.href,
              successUrl: url.href,
              returnUrl: url.href,
            })
            if (error) throw error
            await navigateTo(data.url, { external: true })
          },
        }"
      />

      <UPricingPlan
        :title="'Pro'"
        :price="'$9/mo'"
        description="Unlock bigger uploads, priority processing, and premium features."
        :features="[
          '',
        ]"
        :button="{
          label: 'Upgrade to Pro',
          color: 'primary',
          onClick: async () => {
            const { data, error } = await auth.subscription.upgrade({
              plan: 'pro',
              referenceId: user?.id,
              cancelUrl: url.href,
              successUrl: url.href,
              returnUrl: url.href,
            })
            if (error) throw error
            await navigateTo(data.url, { external: true })
          },
        }"
      />
    </div>
  </UCard>
</template>
