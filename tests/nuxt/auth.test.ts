import { fetch, setup } from '@nuxt/test-utils/e2e'
import { createTRPCClient, httpBatchLink } from '@trpc/client'
import { describe, expect, it } from 'vitest'
import type { AppRouter } from '../../server/trpc'

const PORT = Math.floor(Math.random() * (3999 - 3100 + 1)) + 3100
const BASE_URL = `http://localhost:${PORT}`

describe('auth flow', async () => {
  await setup({ dev: true, port: PORT })

  const trpc = createTRPCClient<AppRouter>({
    links: [httpBatchLink({ url: `${BASE_URL}/api/trpc` })],
  })

  it('ping returns pong without auth', async () => {
    const result = await trpc.ping.query()
    expect(result).toBe('pong')
  })

  it('health returns ok without auth', async () => {
    const result = await trpc.health.query()
    expect(result.status).toBe('ok')
  })

  it('sign up creates a user and sign in returns session', async () => {
    const email = `test+${Date.now()}@example.com`
    const password = 'password123'

    const signUpRes = await fetch('/api/auth/sign-up/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        name: email,
        password,
      }),
    })
    expect(signUpRes.status).toBe(200)

    const signInRes = await fetch('/api/auth/sign-in/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
      }),
    })
    expect(signInRes.status).toBe(200)

    const body = await signInRes.json() as {
      user?: {
        email: string
      }
    }
    expect(body.user?.email).toBe(email)
  })
})
