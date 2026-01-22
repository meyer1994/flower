import { desc, eq } from 'drizzle-orm'
import * as z from 'zod'
import { TUsers } from '~~/server/db/schema'
import { createTRPCRouter, protectedProcedure } from '../lib/trpc'

export const usersRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.db
        .insert(TUsers)
        .values({ name: input.name })
        .returning()
        .get()

      return user
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.db.delete(TUsers).where(eq(TUsers.id, input.id))

      return { success: true }
    }),

  update: protectedProcedure
    .input(z.object({ id: z.string(), name: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.db
        .update(TUsers)
        .set({ name: input.name })
        .where(eq(TUsers.id, input.id))
        .returning()
        .get()

      return user
    }),

  list: protectedProcedure
    .query(async ({ ctx }) => {
      const users = await ctx.db
        .select()
        .from(TUsers)
        .orderBy(desc(TUsers.createdAt))
        .all()

      return users
    }),
})
