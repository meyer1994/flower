import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { filesRouter } from '~~/server/trpc/files'
import { usersRouter } from '~~/server/trpc/users'
import { vectorRouter } from '~~/server/trpc/vector'
import { baseProcedure, createTRPCRouter } from '../lib/trpc'

export const appRouter = createTRPCRouter({
  ping: baseProcedure
    .query(() => {
      return 'pong'
    }),

  health: baseProcedure
    .query(() => {
      const timestamp = new Date().toISOString()

      return { status: 'ok', timestamp }
    }),

  users: usersRouter,
  files: filesRouter,
  vector: vectorRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
export type AppRouterInputs = inferRouterInputs<AppRouter>
export type AppRouterOutputs = inferRouterOutputs<AppRouter>
