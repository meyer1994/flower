import {
  isNonJsonSerializable,
  loggerLink,
  splitLink,
  type TRPCLink,
} from '@trpc/client'
import { createTRPCNuxtClient, httpBatchLink, httpLink } from 'trpc-nuxt/client'
import type { AppRouter } from '~~/server/trpc'

/**
 * The useTRPC composable should not use a cached client instance. otherwise, it
 * will use the wrong headers, the ones from the first requests, resulting in
 * the client being unauthorized in case there were no cookies set yet
 */
export const useTRPC = () => {
  const links: TRPCLink<AppRouter>[] = []

  // only enabled in the client to avoid log of "non-POJO" warnings in the
  // server
  links.push(loggerLink({ enabled: () => typeof window !== 'undefined' }))

  // we must use the full href to avoid issues with cloudflare workers if we do
  // not do this, the trpc client will try to call itself as a worker like an
  // internal request, but that internal request will be missing the whole
  // context of the request... go figure. if we use the href, which is the full
  // url, the request goes to the internet and back, and that will work as a
  // simple normal http request
  links.push(splitLink({
    // we need this split link to be able to send files, and FormData to the
    // trpc server. we cannot use send "multiple" FormData in a single request
    condition: op => isNonJsonSerializable(op.input),
    true: httpLink({ url: '/api/trpc', headers: useRequestHeaders() }),
    false: httpBatchLink({ url: '/api/trpc', headers: useRequestHeaders() }),
  }))

  return createTRPCNuxtClient<AppRouter>({ links })
}
