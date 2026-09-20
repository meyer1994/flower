import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { eq, sql } from 'drizzle-orm'
import z from 'zod'
import { TCounter } from '../db/schema'
import { baseProcedure, createTRPCRouter, protectedProcedure } from '../lib/trpc'

export const appRouter = createTRPCRouter({
  ping: baseProcedure
    .query(() => 'pong'),

  health: baseProcedure
    .query(() => ({
      status: 'ok',
      timestamp: new Date().toISOString(),
    })),

  counter: createTRPCRouter({
    get: protectedProcedure
      .query(async ({ ctx }) => {
        const row = await ctx.db
          .select()
          .from(TCounter)
          .where(eq(TCounter.id, 'BANANA'))
          .get()
        return row ?? { id: 'BANANA', count: 0 }
      }),

    inc: protectedProcedure
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

    dec: protectedProcedure
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
    create: protectedProcedure
      .input(
        z.instanceof(FormData)
          .transform(i => Object.fromEntries(i.entries()))
          .pipe(z.object({
            file: z.instanceof(File)
              .refine(i => i.size > 0)
              .refine(i => i.size < 10 * 1024 * 1024, 'File size must be less than 10MB'),
          })),
      )
      .mutation(async ({ ctx, input }) => {
        const id = crypto.randomUUID()
        await ctx.files.put(id, input.file, { mimeType: input.file.type })
        const url = await ctx.files.url(id)
        return { id, url, name: input.file.name }
      }),

    list: protectedProcedure
      .query(async ({ ctx }) => {
        const files = await ctx.files.list()
        return await Promise.all(files.map(async file => ({
          id: file.key,
          url: await ctx.files.url(file.key),
          mimeType: file.mimeType,
        })))
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.string().min(1) }))
      .mutation(async ({ ctx, input }) => {
        await ctx.files.delete(input.id)
      }),
  }),
})

export type AppRouter = typeof appRouter
export type AppRouterInputs = inferRouterInputs<AppRouter>
export type AppRouterOutputs = inferRouterOutputs<AppRouter>
