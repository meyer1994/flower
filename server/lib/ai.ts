import type { H3Event } from 'h3'
import { createWorkersAI } from 'workers-ai-provider'

// access the Cloudflare Workers AI binding (`env.AI`) through the Vercel AI SDK
export const serverAI = (event: H3Event) =>
  createWorkersAI({ binding: (event.context.cloudflare.env as Env).AI })
