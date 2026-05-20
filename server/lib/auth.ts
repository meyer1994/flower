import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import type { H3Event } from 'h3'
import { serverDrizzle } from './drizzle'

const db = serverDrizzle()

const auth = betterAuth({
  database: drizzleAdapter(db, { provider: 'sqlite' }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },

  trustedOrigins: [
    'localhost:3000', // local dev
    'localhost:8787', // local preview
    '*.workers.dev', // production
  ],
})

export const serverAuth = (_event: H3Event) => auth
