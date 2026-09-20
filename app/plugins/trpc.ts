import { httpLink, isNonJsonSerializable, splitLink } from '@trpc/client'
import { loggerLink } from '@trpc/client/links/loggerLink'
import { createTRPCNuxtClient, httpBatchLink } from 'trpc-nuxt/client'
import type { AppRouter } from '~~/server/trpc'

export default defineNuxtPlugin(() => {
  const links = []
  if (import.meta.dev) links.push(loggerLink())

  // enables form uploads via trpc
  links.push(
    splitLink({
      condition: op => isNonJsonSerializable(op.input),
      true: httpLink({ url: '/api/trpc' }),
      false: httpBatchLink({ url: '/api/trpc' }),
    }),
  )

  const trpc = createTRPCNuxtClient<AppRouter>({ links })
  return { provide: { trpc } }
})
