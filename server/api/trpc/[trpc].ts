import { createTRPCNuxtHandler } from 'trpc-nuxt/server'
import { appRouter } from '../../trpc'
import { createTRPCContext } from '../../utils/trpc'

export default createTRPCNuxtHandler({
  endpoint: '/api/trpc',
  router: appRouter,
  createContext: createTRPCContext,
})
