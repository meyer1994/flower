import { TRPCError, type inferRouterInputs, type inferRouterOutputs } from '@trpc/server'
import { desc, eq } from 'drizzle-orm'
import z from 'zod'
import { TContent } from '../db/schema'
import { baseProcedure, createTRPCRouter, protectedProcedure } from '../lib/trpc'

export const appRouter = createTRPCRouter({
  ping: baseProcedure
    .query(() => 'pong'),

  health: baseProcedure
    .query(() => ({
      status: 'ok',
      timestamp: new Date().toISOString(),
    })),

  editor: createTRPCRouter({
    create: baseProcedure
      .mutation(async ({ ctx }) => {
        const row = await ctx.db
          .insert(TContent)
          .values({ body: '' })
          .returning()
          .get()
        if (!row) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
        return row
      }),

    update: baseProcedure
      .input(z.object({ id: z.string().min(1), body: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const row = await ctx.db
          .insert(TContent)
          .values({ id: input.id, body: input.body })
          .returning()
          .get()
        if (!row) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
        return row
      }),

    get: baseProcedure
      .input(z.object({ id: z.string().min(1) }))
      .query(async ({ ctx, input }) => {
        const row = await ctx.db
          .select()
          .from(TContent)
          .where(eq(TContent.id, input.id))
          .orderBy(desc(TContent.createdAt))
          .limit(1)
          .get()
        if (!row) throw new TRPCError({ code: 'NOT_FOUND' })
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
