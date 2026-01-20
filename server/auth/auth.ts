import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import type { H3Event } from 'h3'

export const serverAuth = (event: H3Event): ReturnType<typeof betterAuth> => {
  return betterAuth({
    database: drizzleAdapter(event.context.db, { provider: 'sqlite' }),

    emailAndPassword: {
      enabled: true,
    },
  })
}
