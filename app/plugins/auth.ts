import { createAuthClient } from 'better-auth/vue'

export default defineNuxtPlugin(() => {
  const url = useRequestURL()

  // Adapted from:
  // https://better-auth.com/docs/integrations/nuxt#use-the-client-during-ssr
  const headers = import.meta.server ? useRequestHeaders(['cookie']) : undefined

  const auth = createAuthClient({
    baseURL: url.origin,
    fetchOptions: { headers },
  })

  const useSession = async () => await auth.useSession(useFetch)

  return { provide: { auth: { client: auth, useSession } } }
})
