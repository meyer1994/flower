import type {
  BetterAuthClientOptions as ClientOptions,
  InferSessionFromClient,
  InferUserFromClient,
} from 'better-auth/client'
import { createAuthClient } from 'better-auth/vue'

export function useAuth() {
  const url = useRequestURL()
  const headers = useRequestHeaders()

  const client = createAuthClient({
    baseURL: url.origin,
    fetchOptions: { headers },
  })

  type User = InferUserFromClient<ClientOptions>
  type Session = InferSessionFromClient<ClientOptions>
  type Data = { user: User, session: Session }

  const sessionUrl = new URL('/api/auth/get-session', url.origin)
  console.info('[client.auth] sessionUrl', sessionUrl.href)

  const { data: session, status, refresh } = useFetch<Data>(sessionUrl.href, {
    headers,
  })

  const isFetching = computed(() => status.value === 'pending')
  const user = computed(() => session.value?.user || null)
  const loggedIn = computed(() => !!session.value)

  const fetchSession = async () => {
    if (isFetching.value) return
    await refresh()
    return session.value
  }

  if (import.meta.client) {
    client.$store.listen('$sessionSignal', async (signal) => {
      if (!signal) return
      await fetchSession()
    })
  }

  return {
    session,
    user,
    loggedIn,
    signIn: client.signIn,
    signOut: client.signOut,
    signUp: client.signUp,
    fetchSession,
    client,
  }
}
