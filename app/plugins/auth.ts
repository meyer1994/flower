import { createAuthClient } from 'better-auth/vue'

export default defineNuxtPlugin(() => {
  const url = useRequestURL()
  const headers = useRequestHeaders()

  const auth = createAuthClient({
    baseURL: url.origin,
    fetchOptions: { headers },
  })

  const useSession = async () => await auth.useSession(useFetch)

  return {
    provide: {
      auth: {
        signOut: auth.signOut,
        signIn: auth.signIn,
        signUp: auth.signUp,
        useSession,
      },
    },
  }
})
