import type { JSONContent } from '@tiptap/core'
import { TRPCError, type inferRouterInputs, type inferRouterOutputs } from '@trpc/server'
import { generateText } from 'ai'
import { asc, desc, eq } from 'drizzle-orm'
import z from 'zod'
import { TAiQuery, TChatMessage, TContent } from '../db/schema'
import { baseProcedure, createTRPCRouter } from '../lib/trpc'

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
          .values({ body: { type: 'doc', content: [] } })
          .returning()
          .get()
        if (!row) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
        return row
      }),

    update: baseProcedure
      .input(z.object({ id: z.string().min(1), body: z.custom<JSONContent>() }))
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

  chat: createTRPCRouter({
    list: baseProcedure
      .input(z.object({ chatId: z.string().min(1) }))
      .query(async ({ ctx, input }) => {
        return await ctx.db
          .select()
          .from(TChatMessage)
          .where(eq(TChatMessage.chatId, input.chatId))
          .orderBy(asc(TChatMessage.createdAt))
          .all()
      }),

    ask: baseProcedure
      .input(z.object({
        chatId: z.string().min(1),
        text: z.string().min(1),
      }))
      .mutation(async ({ ctx, input }) => {
        // persist the user message
        await ctx.db
          .insert(TChatMessage)
          .values({ chatId: input.chatId, role: 'user', text: input.text })
          .run()

        // build conversation history
        const history = await ctx.db
          .select()
          .from(TChatMessage)
          .where(eq(TChatMessage.chatId, input.chatId))
          .orderBy(asc(TChatMessage.createdAt))
          .all()

        // generate a non-streaming reply with Workers AI
        const result = await generateText({
          model: ctx.ai('@cf/zai-org/glm-5.3-flash'),
          instructions: 'You are a helpful assistant. Keep answers concise.',
          messages: history.map(m => ({ role: m.role, content: m.text })),
        })

        // persist the assistant reply
        const row = await ctx.db
          .insert(TChatMessage)
          .values({ chatId: input.chatId, role: 'assistant', text: result.text })
          .returning()
          .get()
        if (!row) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
        return row
      }),

    append: baseProcedure
      .input(z.object({
        text: z.string().min(1),
        role: z.enum(['user', 'assistant']),
        chatId: z.string().min(1).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const row = await ctx.db
          .insert(TChatMessage)
          .values(input)
          .returning()
          .get()
        if (!row) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
        return row
      }),

    clear: baseProcedure
      .input(z.object({ chatId: z.string().min(1) }))
      .mutation(async ({ ctx, input }) => {
        await ctx.db
          .delete(TChatMessage)
          .where(eq(TChatMessage.chatId, input.chatId))
      }),
  }),

  ai: createTRPCRouter({
    ask: baseProcedure
      .input(z.object({ prompt: z.string().min(1) }))
      .mutation(async ({ ctx, input }) => {
        const result = await generateText({
          model: ctx.ai('@cf/zai-org/glm-5.3-flash'),
          instructions: 'You are a helpful assistant. Keep answers concise.',
          prompt: input.prompt,
        })

        const row = await ctx.db.insert(TAiQuery)
          .values({ prompt: input.prompt, response: result.text })
          .returning()
          .get()

        if (!row) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
        return row
      }),

    get: baseProcedure
      .input(z.object({ id: z.string().min(1) }))
      .query(async ({ ctx, input }) => {
        return await ctx.db
          .select()
          .from(TAiQuery)
          .where(eq(TAiQuery.id, input.id))
          .get() ?? null
      }),
  }),

  files: createTRPCRouter({
    create: baseProcedure
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

    get: baseProcedure
      .input(z.object({ id: z.string().min(1) }))
      .query(async ({ ctx, input }) => {
        const meta = await ctx.files.meta(input.id)
        if (!meta) throw new TRPCError({ code: 'NOT_FOUND' })
        return { ...meta, url: await ctx.files.url(input.id) }
      }),

    list: baseProcedure
      .query(async ({ ctx }) => {
        const files = await ctx.files.list()
        return await Promise.all(files.map(async file => ({
          id: file.key,
          url: await ctx.files.url(file.key),
          mimeType: file.mimeType,
        })))
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
