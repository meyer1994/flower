import { z } from 'zod'
import { serverFiles } from '../lib/files'
import { createTRPCRouter, protectedProcedure } from '../lib/trpc'

export const filesRouter = createTRPCRouter({
  list: protectedProcedure
    .query(async ({ ctx }) => {
      const storage = serverFiles(ctx.event)
      const keys = await storage.getKeys()
      return keys
    }),

  upload: protectedProcedure
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
      const storage = serverFiles(ctx.event)
      await storage.setItemRaw(input.file.name, input.file, { contentType: input.file.type })
      return { success: true }
    }),
})
