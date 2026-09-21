import { createTRPCClient, httpBatchLink, httpLink, isNonJsonSerializable, splitLink } from '@trpc/client'
import { loggerLink } from '@trpc/client/links/loggerLink'
import type { AppRouter } from '~~/server/trpc'

export default defineNuxtPlugin(() => {
  const headers = useRequestHeaders()
  const url = useRequestURL()

  const links = []
  if (import.meta.dev && !import.meta.server) links.push(loggerLink())

  // enables form uploads via trpc
  links.push(
    splitLink({
      condition: op => isNonJsonSerializable(op.input),
      true: httpLink({ url: `${url.origin}/api/trpc`, headers }),
      false: httpBatchLink({ url: `${url.origin}/api/trpc`, headers }),
    }),
  )

  const trpc = createTRPCClient<AppRouter>({ links })
  return { provide: { trpc } }
})
