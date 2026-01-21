export default defineNuxtPlugin(async (app) => {
  if (!app.payload.serverRendered) {
    const auth = useAuth()
    await auth.fetchSession()
  }
  else if (Boolean(app.payload.prerenderedAt) || Boolean(app.payload.isCached)) {
    // To avoid hydration mismatch
    app.hook('app:mounted', async () => {
      const auth = useAuth()
      await auth.fetchSession()
    })
  }
})
