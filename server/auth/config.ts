import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { drizzle } from 'drizzle-orm/sql-js'
import * as schema from '../db/schema'

const path = 'file:.wrangler/state/v3/d1/miniflare-D1DatabaseObject/8befad10b517d8504eac77fd56fa57ff3aaf1d2fb9ced818ed78208b928e2de0.sqlite'
const db = drizzle(path, { schema })

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'sqlite',
    schema,
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
})
