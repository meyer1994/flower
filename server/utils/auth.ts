import type { SecondaryStorage } from 'better-auth'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import type { H3Event } from 'h3'
import { serverDrizzle } from './drizzle'

const serverAuthSecondaryStorage = (event: H3Event): SecondaryStorage => {
  const kv = event.context.cloudflare.env.KV as KVNamespace

  return {
    get: async (key: string) => {
      const value = await kv.get(key)

      return value
    },
    set: async (key: string, value: string, ttl?: number) => {
      if (!ttl) return await kv.put(key, value)
      const timetolive = Math.max(ttl, 60)
      return await kv.put(key, value, { expirationTtl: timetolive })
    },
    delete: async (key: string) => {
      return await kv.delete(key)
    },
  }
}

export const serverAuth = (event: H3Event): ReturnType<typeof betterAuth> => {
  const db = serverDrizzle(event)

  return betterAuth({
    database: drizzleAdapter(db, { provider: 'sqlite' }),

    logger: {
      level: 'info',
      enabled: true,
      log: (level, message, ...args) => {
        console.info(`[BetterAuth] ${level} ${message}`, ...args)
      },
    },

    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },

    // session: {
    //   cookieCache: {
    //     enabled: true,
    //     maxAge: 300, // 5 minutes cache duration
    //     strategy: 'jwe', // can be "jwt" or "compact"
    //     refreshCache: true, // Enable stateless refresh
    //   },
    // },

    // account: {
    //   storeStateStrategy: 'cookie',
    //   // Store account data after OAuth flow in a cookie (useful for
    //   // database-less flows)
    //   storeAccountCookie: true,
    // },

    trustedOrigins: [
      'http://localhost:3000',
      'http://localhost:8787',
      'https://*.meyer1994.workers.dev',
    ],

    secondaryStorage: serverAuthSecondaryStorage(event),
  })
}
