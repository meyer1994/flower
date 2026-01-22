import { createAuthClient } from 'better-auth/vue'

export function useAuth() {
  const url = useRequestURL()
  const headers = useRequestHeaders()

  const client = createAuthClient({
    baseURL: url.origin,
    fetchOptions: { headers },
  })

  const { data, refresh } = useAsyncData('session', async () => {
    console.info('[client.auth] fetching session')
    const session = await client.getSession()
    return session.data
  }, { server: false })

  const user = computed(() => data.value?.user || null)
  const session = computed(() => data.value?.session || null)
  const loggedIn = computed(() => !!data.value?.user)

  const fetchSession = async () => {
    await refresh()
    return session.value
  }

  const signOut = async () => {
    await client.signOut()
    data.value = null
    await refresh()
  }

  return {
    user,
    session,
    loggedIn,
    client,
    signIn: client.signIn,
    signOut,
    signUp: client.signUp,
    fetchSession,
  }
}
