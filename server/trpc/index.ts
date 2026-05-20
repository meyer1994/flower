import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { eq, sql } from 'drizzle-orm'
import { TCounter } from '../db/schema'
import { baseProcedure, createTRPCRouter } from '../lib/trpc'

const COUNTER_ID = 'global'

export const appRouter = createTRPCRouter({
  ping: baseProcedure
    .query(() => 'pong'),

  health: baseProcedure
    .query(() => ({
      status: 'ok',
      timestamp: new Date().toISOString(),
    })),

  counter: createTRPCRouter({
    get: baseProcedure
      .query(async ({ ctx }) => {
        const row = await ctx.db
          .select()
          .from(TCounter)
          .where(eq(TCounter.id, COUNTER_ID))
          .get()
        return { count: row?.count ?? 0 }
      }),

    increment: baseProcedure
      .mutation(async ({ ctx }) => {
        const row = await ctx.db
          .insert(TCounter)
          .values({ id: COUNTER_ID, count: 1 })
          .onConflictDoUpdate({
            target: TCounter.id,
            set: { count: sql`${TCounter.count} + 1` },
          })
          .returning()
          .get()
        return { count: row?.count ?? 0 }
      }),
  }),
})

export type AppRouter = typeof appRouter
export type AppRouterInputs = inferRouterInputs<AppRouter>
export type AppRouterOutputs = inferRouterOutputs<AppRouter>
