export default defineNuxtPlugin(async (nuxtApp) => {
  if (!nuxtApp.payload.serverRendered) {
    const auth = useAuth()
    await auth.fetchSession()
  }
  else if (Boolean(nuxtApp.payload.prerenderedAt) || Boolean(nuxtApp.payload.isCached)) {
    // To avoid hydration mismatch
    nuxtApp.hook('app:mounted', async () => {
      const auth = useAuth()
      await auth.fetchSession()
    })
  }
})
