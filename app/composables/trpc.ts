import {
  isNonJsonSerializable,
  loggerLink,
  splitLink,
  type TRPCLink,
} from '@trpc/client'
import { createTRPCNuxtClient, httpBatchLink, httpLink } from 'trpc-nuxt/client'
import type { AppRouter } from '~~/server/trpc'

let trpc: ReturnType<typeof createTRPCNuxtClient<AppRouter>> | null = null

export const useTRPC = () => {
  if (trpc) return trpc

  const url = useRequestURL()
  url.pathname = '/api/trpc'

  const links: TRPCLink<AppRouter>[] = []

  // Client-side initialization using standard HTTP transport. We use
  // splitLink to handle both standard JSON and non-serializable data (like
  // Files).
  links.push(loggerLink({ enabled: () => typeof window !== 'undefined' }))

  links.push(splitLink({
    condition: op => isNonJsonSerializable(op.input),
    true: httpLink({ url }),
    false: httpBatchLink({ url }),
  }))

  trpc = createTRPCNuxtClient<AppRouter>({ links })
  return trpc
}
