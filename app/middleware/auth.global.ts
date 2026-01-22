declare module '#app' {
  interface PageMeta {
    auth?: boolean
  }
}

declare module 'vue-router' {
  interface RouteMeta {
    auth?: boolean
  }
}

export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return // do not validate on server
  if (!to.meta.auth) return // do not validate if no auth meta is set1

  const { loggedIn, fetchSession } = useAuth()
  if (import.meta.client) await fetchSession()

  if (!loggedIn.value) return abortNavigation()
})
