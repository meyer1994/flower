import { serverAuth } from '~~/server/lib/auth'

export default defineEventHandler(async (event) => {
  const start = Date.now()
  console.info(`[server.auth] ${event.method} ${event.path}`)

  const auth = serverAuth(event)
  const response = await auth.handler(toWebRequest(event))

  console.info(`[server.auth] done in ${Date.now() - start}ms`)
  return response
})
