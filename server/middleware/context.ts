import type { DrizzleD1Database } from 'drizzle-orm/d1'
import { drizzle } from 'drizzle-orm/d1'
import { serverAuth } from '../auth/auth'
import * as schema from '../db/schema'

let db: DrizzleD1Database<typeof schema> | null = null

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)

  if (!db) {
    db = drizzle(event.context.cloudflare.env.DB, { schema })
    console.info('[Middleware] DB initialized')
  }

  event.context.db = db // need to set db before auth
  event.context.auth = serverAuth(event)

  if (!event.context.cloudflare?.env?.BUCKET) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Cloudflare R2 BUCKET binding not found',
    })
  }

  if (!config.aws.bucket) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Runtime config AWS_BUCKET not found',
    })
  }

  event.context.storage = new R2Storage(
    event.context.cloudflare.env.BUCKET,
    config.aws.bucket,
  )

  event.context.vector = new CloudflareVectorizeStorage(
    event.context.cloudflare.env,
    event.context.storage,
  )
})
