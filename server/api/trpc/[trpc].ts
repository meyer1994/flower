import { createTRPCNuxtHandler } from 'trpc-nuxt/server'
import { createTRPCContext } from '~~/server/lib/trpc'
import { appRouter } from '~~/server/trpc'

export default createTRPCNuxtHandler({
  endpoint: '/api/trpc',
  router: appRouter,
  createContext: createTRPCContext,
})
