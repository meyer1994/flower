import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import type { H3Event } from 'h3'
import * as schema from '../db/schema'
import type { Database } from './drizzle'
import { serverDrizzle } from './drizzle'

export const createAuth = <T extends Database>(db: T) => {
  return betterAuth({
    database: drizzleAdapter(db, { provider: 'sqlite', schema }),

    advanced: {
      disableOriginCheck: import.meta.dev,
    },

    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },

    plugins: [],

    trustedOrigins: [
      'http://localhost:3000', // local dev
      'http://localhost:8787', // local preview
      'https://*.meyer1994.workers.dev', // production
    ],
  })
}

export const serverAuth = (event: H3Event) => {
  const db = serverDrizzle(event)
  return createAuth(db)
}
