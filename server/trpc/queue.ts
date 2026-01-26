import { z } from 'zod'
import { baseProcedure, createTRPCRouter } from '../lib/trpc'

export const queueRouter = createTRPCRouter({
  send: baseProcedure
    .input(z.object({
      message: z.string().min(1),
    }))
    .mutation(async ({ input, ctx }) => {
      const payload = {
        message: input.message,
        timestamp: new Date().toISOString(),
      }

      await ctx.queue.send(payload)

      return { success: true, payload }
    }),
})
