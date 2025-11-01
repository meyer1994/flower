import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { desc, eq } from 'drizzle-orm'
import * as z from 'zod'
import { TUsers } from '../db/schema'
import { baseProcedure, createTRPCRouter } from '../utils/trpc'

export const appRouter = createTRPCRouter({
  ping: baseProcedure
    .query(() => 'pong'),

  health: baseProcedure
    .query(() => ({
      status: 'ok',
      timestamp: new Date().toISOString(),
    })),

  users: createTRPCRouter({
    create: baseProcedure
      .input(z.object({ name: z.string() }))
      .mutation(async ({ input, ctx }) => {
        const [user] = await ctx.db
          .insert(TUsers)
          .values({ name: input.name })
          .returning()
        return user
      }),

    delete: baseProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input, ctx }) => {
        await ctx.db.delete(TUsers).where(eq(TUsers.id, input.id))
        return { success: true }
      }),

    update: baseProcedure
      .input(
        z.object({
          id: z.string(),
          name: z.string(),
        }),
      )
      .mutation(async ({ input, ctx }) => {
        const [user] = await ctx.db
          .update(TUsers)
          .set({ name: input.name })
          .where(eq(TUsers.id, input.id))
          .returning()
        return user
      }),

    list: baseProcedure
      .query(async ({ ctx }) => {
        return await ctx.db
          .select()
          .from(TUsers)
          .orderBy(desc(TUsers.createdAt))
      }),
  }),

  files: createTRPCRouter({
    list: baseProcedure
      .query(async ({ ctx }) => {
        return await ctx.files.list()
      }),

    put: baseProcedure
      .input(
        z.instanceof(FormData)
          .transform(e => Object.fromEntries(e.entries()))
          .pipe(
            z.object({
              key: z.string(),
              file: z.instanceof(File).refine(f => f.size > 0),
            })),
      )
      .mutation(async ({ input, ctx }) => {
        const buffer = await input.file.arrayBuffer()
        console.log('buffer', buffer)
        await ctx.files.put(input.key, new Uint8Array(buffer))
      }),

    url: baseProcedure
      .input(z.object({ key: z.string() }))
      .query(async ({ input, ctx }) => {
        return await ctx.files.url(input.key)
      }),
  }),
})

// export type definition of API
export type AppRouter = typeof appRouter
export type AppRouterInputs = inferRouterInputs<AppRouter>
export type AppRouterOutputs = inferRouterOutputs<AppRouter>
