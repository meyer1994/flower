import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { eq, sql } from 'drizzle-orm'
import z from 'zod'
import { TCounter } from '../db/schema'
import { baseProcedure, createTRPCRouter } from '../lib/trpc'

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
          .where(eq(TCounter.id, 'BANANA'))
          .get()
        return row ?? { id: 'BANANA', count: 0 }
      }),

    inc: baseProcedure
      .mutation(async ({ ctx }) => {
        const row = await ctx.db
          .insert(TCounter)
          .values({ id: 'BANANA', count: 0 })
          .onConflictDoUpdate({
            target: [TCounter.id],
            set: { count: sql`${TCounter.count} + 1` },
          })
          .returning()
          .get()
        return row
      }),

    dec: baseProcedure
      .mutation(async ({ ctx }) => {
        const row = await ctx.db
          .insert(TCounter)
          .values({ id: 'BANANA', count: 0 })
          .onConflictDoUpdate({
            target: [TCounter.id],
            set: { count: sql`${TCounter.count} - 1` },
          })
          .returning()
          .get()
        return row
      }),
  }),

  files: createTRPCRouter({
    create: baseProcedure
      .input(z.object({ file: z.instanceof(File) }))
      .mutation(async ({ ctx, input }) => {
        const id = crypto.randomUUID()
        await ctx.files.put(id, input.file, { mimeType: input.file.type })
        const url = await ctx.files.url(id)
        return { id, url }
      }),

    list: baseProcedure
      .query(async ({ ctx }) => {
        const files = await ctx.files.list()
        return await Promise.all(files
          .map(async file => ({ id: file, url: await ctx.files.url(file) })))
      }),

    delete: baseProcedure
      .input(z.object({ id: z.string().min(1) }))
      .mutation(async ({ ctx, input }) => {
        await ctx.files.delete(input.id)
      }),
  }),
})

export type AppRouter = typeof appRouter
export type AppRouterInputs = inferRouterInputs<AppRouter>
export type AppRouterOutputs = inferRouterOutputs<AppRouter>
