import { initTRPC, TRPCError, type AnyRouter } from '@trpc/server'
import type { DrizzleD1Database } from 'drizzle-orm/d1'
import type { H3Event } from 'h3'
import type { serverAuth } from '../auth/auth'
import type * as schema from '../db/schema'
import type { FileStorage } from '../utils/storage'
import type { VectorStorage } from '../utils/vector'

export type TRPCContext = {
  db: DrizzleD1Database<typeof schema>
  storage: FileStorage
  vector: VectorStorage
  event: H3Event
  auth: ReturnType<typeof serverAuth>
  user: typeof schema.user.$inferSelect | null | undefined
  session: typeof schema.session.$inferSelect | null | undefined
}

export const createTRPCContext = async (event: H3Event) => {
  /**
  * @see: https://trpc.io/docs/server/context
  */
  return {
    event,
    db: event.context.db,
    storage: event.context.storage,
    vector: event.context.vector,
    auth: event.context.auth,
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

const isAuthenticated = t.middleware(async ({ next, ctx }) => {
  const session = await ctx.auth.api.getSession({ headers: ctx.event.headers })
  if (!session) throw new TRPCError({ code: 'UNAUTHORIZED' })
  if (!session.user) throw new TRPCError({ code: 'UNAUTHORIZED' })
  return next({ ctx: { ...ctx, user: session.user, session: session.session } })
})

// Base router and procedure helpers
export const createTRPCRouter = t.router
export const createCallerFactory = t.createCallerFactory
export const baseProcedure = t.procedure
export const protectedProcedure = t.procedure.use(isAuthenticated)

/**
 * Creates an internal tRPC caller for SSR to bypass HTTP subrequests.
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createInternalCaller = async <TRouter extends AnyRouter>(
  router: TRouter,
  event: H3Event,
) => {
  const context = await createTRPCContext(event)
  return createCallerFactory(router)(context)
}
