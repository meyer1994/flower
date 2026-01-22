import type { SecondaryStorage } from 'better-auth'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import type { H3Event } from 'h3'
import { serverDrizzle } from './drizzle'

const serverAuthSecondaryStorage = (event: H3Event): SecondaryStorage => {
  const kv = event.context.cloudflare.env.KV as KVNamespace

  return {
    get: async (key: string) => {
      console.info('[server.auth.cache] get', key)
      const value = await kv.get(key)
      console.info('[server.auth.cache] get result', key, value ? 'HIT' : 'MISS')
      return value
    },
    set: async (key: string, value: string, ttl?: number) => {
      console.info('[server.auth.cache] set', key, { ttl })
      if (!ttl) {
        await kv.put(key, value)
        console.info('[server.auth.cache] set completed', key, 'no TTL')
        return
      }
      await kv.put(key, value, { expirationTtl: Math.max(ttl ?? 0, 60) })
      console.info('[server.auth.cache] set completed', key, 'with TTL', ttl)
    },
    delete: async (key: string) => {
      console.info('[server.auth.cache] delete', key)
      await kv.delete(key)
      console.info('[server.auth.cache] delete completed', key)
    },
  }
}

export const serverAuth = (event: H3Event): ReturnType<typeof betterAuth> => {
  const db = serverDrizzle(event)

  return betterAuth({
    database: drizzleAdapter(db, { provider: 'sqlite' }),

    logger: {
      level: 'debug',
      disabled: !import.meta.dev,
      log: (level, message, ...args) => {
        console.info(`[server.auth] ${level} ${message}`, ...args)
      },
    },

    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },

    session: {
      cookieCache: {
        enabled: false,
      },
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
