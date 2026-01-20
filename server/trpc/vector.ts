import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from './init'

export const vectorRouter = createTRPCRouter({
  search: protectedProcedure
    .input(z.object({
      query: z.string().min(1),
      prefix: z.string().optional(),
    }))
    .query(async ({ input, ctx }) => {
      console.info(`[tRPC] Vector search: "${input.query}" (prefix: ${input.prefix ?? 'none'})`)
      return await ctx.vector.search(input.query, {
        prefix: input.prefix ?? undefined,
      })
    }),
})
