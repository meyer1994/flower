import type {
  BetterAuthClientOptions as ClientOptions,
  InferSessionFromClient,
  InferUserFromClient,
} from 'better-auth/client'
import { createAuthClient } from 'better-auth/vue'

export function useAuth() {
  const url = useRequestURL()
  const headers = import.meta.server ? useRequestHeaders() : undefined

  const client = createAuthClient({
    baseURL: url.origin,
    fetchOptions: { headers },
  })

  type User = InferUserFromClient<ClientOptions>
  type Session = InferSessionFromClient<ClientOptions>

  const user = useState<User | null>('auth:user', () => null)
  const session = useState<Session | null>('auth:session', () => null)

  const isFetching = import.meta.server ? ref(false) : useState('auth:sessionFetching', () => false)

  const fetchSession = async () => {
    if (isFetching.value) return

    isFetching.value = true
    try {
      const { data } = await client.getSession()
      session.value = data?.session || null
      user.value = data?.user || null
      return data
    }
    catch (error) {
      console.error('[Auth] fetchSession error', error)
      throw error
    }
    finally {
      isFetching.value = false
    }
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
    loggedIn: computed(() => !!session.value),
    signIn: client.signIn,
    signOut: client.signOut,
    signUp: client.signUp,
    fetchSession,
    client,
  }
}
