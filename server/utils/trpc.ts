import { initTRPC } from '@trpc/server'
import { drizzle } from 'drizzle-orm/d1'
import type { H3Event } from 'h3'
import * as schema from '~~/server/db/schema'
import { FileStorage, useFilesR2 } from './files'

export const createTRPCContext = async (event: H3Event) => {
  /**
  * @see: https://trpc.io/docs/server/context
  */
  const config = useRuntimeConfig(event)

  let files: FileStorage
  switch (config.files.type) {
    case 's3':
      files = useFilesS3(event)
      break
    case 'r2':
      files = useFilesR2(event)
      break
    default:
      throw new Error('File storage not configured')
  }

  // @ts-ignore
  const db = drizzle(event.context.cloudflare.env.DB, { schema })
  
  type Context = { event: H3Event, db: typeof db, files: typeof files }
  return { event, db, files } as Context
}

type Context = Awaited<ReturnType<typeof createTRPCContext>>

// Avoid exporting the entire t-object since it's not very descriptive. For
// instance, the use of a t variable is common in i18n libraries.
const t = initTRPC.context<Context>().create({
  /**
  * @see https://trpc.io/docs/server/data-transformers
  */
  // transformer: superjson,
})

// Base router and procedure helpers
export const createTRPCRouter = t.router
export const createCallerFactory = t.createCallerFactory

export const baseProcedure = t.procedure
  .use(async ({ next }) => {
    try {
      console.log('Starting request')
      return await next()
    } catch (error) {
      console.error('Error in request')
      console.error(error)
      throw error
    }
    finally {
      console.log('Request finished')
    }
  }
)
