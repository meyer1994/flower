import type { Logger } from 'drizzle-orm'
import type { DrizzleD1Database } from 'drizzle-orm/d1/driver'
import { drizzle } from 'drizzle-orm/d1/driver'
import type { H3Event } from 'h3'
import type * as schema from '../db/schema'

export type Database = DrizzleD1Database<typeof schema>

export const serverDrizzle = (event: H3Event): Database => {
  const env = event.context.cloudflare.env as Env

  const logger: Logger = {
    logQuery: (query, params) => {
      if (!import.meta.dev) return
      console.debug('[server.drizzle] query', { query, params })
    },
  }

  return drizzle<typeof schema>(env.DB, { logger })
}
