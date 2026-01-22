import { initTRPC, TRPCError, type AnyRouter } from '@trpc/server'
import type { BetterAuthClientOptions, InferSessionFromClient, InferUserFromClient } from 'better-auth'
import type { H3Event } from 'h3'
import { serverStorage } from '../utils/storage'
import { serverVector } from '../utils/vector'
import { serverAuth } from './auth'
import { serverDrizzle } from './drizzle'

export type TRPCContext = {
  event: H3Event
  db: ReturnType<typeof serverDrizzle>
  storage: ReturnType<typeof serverStorage>
  vector: ReturnType<typeof serverVector>
  auth: ReturnType<typeof serverAuth>
  user: InferUserFromClient<BetterAuthClientOptions> | null
  session: InferSessionFromClient<BetterAuthClientOptions> | null
}

export const createTRPCContext = async (event: H3Event) => {
  /**
  * @see: https://trpc.io/docs/server/context
  */

  return {
    event,
    db: serverDrizzle(event),
    storage: serverStorage(event),
    vector: serverVector(event),
    auth: serverAuth(event),
    user: null,
    session: null,
  } satisfies TRPCContext
}

// Avoid exporting the entire t-object since it's not very descriptive. For
// instance, the use of a t variable is common in i18n libraries.
const t = initTRPC.context<TRPCContext>().create({
  /**
  * @see https://trpc.io/docs/server/data-transformers
  */
  // transformer: superjson,
})

const logger = t.middleware(async ({ next, ctx }) => {
  const path = ctx.event.path.split('?')[0]
  console.info(`[TRPC] start ${path}`)
  const start = Date.now()

  const result = await next({ ctx })

  const duration = Date.now() - start
  console.info(`[TRPC] end ${path} - ${duration}ms`)
  return result
})

const isAuthenticated = t.middleware(async ({ next, ctx }) => {
  const session = await ctx.auth.api.getSession({ headers: ctx.event.headers })
  if (!session) throw new TRPCError({ code: 'UNAUTHORIZED' })
  if (!session.user) throw new TRPCError({ code: 'UNAUTHORIZED' })

  const path = ctx.event.path.split('?')[0]
  console.info(`[TRPC] isAuthenticated ${path}`)

  return next({ ctx: { ...ctx, user: session.user, session: session.session } })
})

// Base router and procedure helpers
export const createTRPCRouter = t.router
export const createCallerFactory = t.createCallerFactory
export const baseProcedure = t.procedure.use(logger)
export const protectedProcedure = t.procedure.use(logger).use(isAuthenticated)

/**
 * Creates an internal tRPC caller for SSR to bypass HTTP subrequests.
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const serverTRPC = async <TRouter extends AnyRouter>(
  router: TRouter,
  event: H3Event,
) => {
  const context = await createTRPCContext(event)
  return createCallerFactory(router)(context)
}
