import { TRPCError, initTRPC } from '@trpc/server'
import type { BetterAuthClientOptions, InferSessionFromClient, InferUserFromClient } from 'better-auth'
import type { H3Event } from 'h3'
import { serverAI } from './ai'
import { serverAuth } from './auth'
import { serverDrizzle } from './drizzle'
import { serverFiles } from './files'

type Session = {
  user: InferUserFromClient<BetterAuthClientOptions>
  session: InferSessionFromClient<BetterAuthClientOptions>
}

export type TRPCContext = {
  event: H3Event

  db: ReturnType<typeof serverDrizzle>
  auth: ReturnType<typeof serverAuth>
  files: ReturnType<typeof serverFiles>
  ai: ReturnType<typeof serverAI>

  session: Session | null
}

export const createTRPCContext = async (event: H3Event): Promise<TRPCContext> => {
  const db = serverDrizzle(event)
  const auth = serverAuth(event)
  const files = serverFiles(event)
  const ai = serverAI(event)

  const session = await auth.api.getSession({ headers: event.headers })

  console.info('[server.trpc] user id', session?.user?.id)
  return { event, db, auth, files, ai, session }
}

const t = initTRPC.context<TRPCContext>().create()

const logger = t.middleware(async ({ next, ctx }) => {
  const path = ctx.event.path.split('?')[0]
  console.info(`[server.trpc] start ${path}`)

  const start = Date.now()
  const result = await next({ ctx })
  const end = Date.now()
  console.info(`[server.trpc] end ${path} - ${end - start}ms`)

  if (!result.ok) throw createError({
    status: 500,
    message: result.error.message,
    data: result.error,
  })

  return result
})

const isAuthenticated = t.middleware(async ({ next, ctx }) => {
  if (!ctx.session?.user) throw new TRPCError({ code: 'FORBIDDEN' })
  type Context = TRPCContext & { session: Session }
  return next({ ctx: ctx as Context })
})

export const createTRPCRouter = t.router
export const createCallerFactory = t.createCallerFactory
export const baseProcedure = t.procedure.use(logger)
export const protectedProcedure = t.procedure.use(logger).use(isAuthenticated)
