import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { createTRPCContext } from '~~/server/lib/trpc'
import { appRouter } from '~~/server/trpc'

export default defineEventHandler(async (event) => {
  return fetchRequestHandler({
    router: appRouter,
    endpoint: '/api/trpc',
    req: toWebRequest(event),
    createContext: () => createTRPCContext(event),
  })
})
