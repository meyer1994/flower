import { desc, eq } from 'drizzle-orm'
import { z } from 'zod'
import { TTasks } from '../db/schema'
import { baseProcedure, createTRPCRouter } from '../lib/trpc'

export const queueRouter = createTRPCRouter({
  send: baseProcedure
    .input(z.object({
      message: z.string().min(1),
    }))
    .mutation(async ({ input, ctx }) => {
      // Create task record in database
      const task = await ctx.db
        .insert(TTasks)
        .values({ message: input.message, status: 'SENDING' })
        .returning()
        .get()

      await ctx.queue.send({
        id: task.id,
        message: input.message,
      })

      await ctx.db.update(TTasks)
        .set({ status: 'RUNNING' })
        .where(eq(TTasks.id, task.id))

      return task
    }),

  list: baseProcedure
    .query(async ({ ctx }) => {
      return await ctx.db
        .select()
        .from(TTasks)
        .orderBy(desc(TTasks.createdAt))
        .limit(50)
    }),
})
