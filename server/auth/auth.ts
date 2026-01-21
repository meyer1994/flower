import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import type { H3Event } from 'h3'

export const serverAuth = (event: H3Event): ReturnType<typeof betterAuth> => {
  const kv = event.context.cloudflare.env.KV

  return betterAuth({
    database: drizzleAdapter(event.context.db, { provider: 'sqlite' }),
    secondaryStorage: {
      get: async (key: string) => await kv.get(key),
      delete: async (key: string) => await kv.delete(key),
      set: async (key: string, value: string, ttl?: number) => {
        if (!ttl) return await kv.put(key, value)
        const timetolive = Math.max(ttl ?? 60, 60)
        return await kv.put(key, value, { expirationTtl: timetolive })
      },
    },

    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
  })
}
