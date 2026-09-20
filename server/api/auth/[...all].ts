import { serverAuth } from '~~/server/lib/auth'

export default defineEventHandler((event) => {
  const auth = serverAuth(event)
  return auth.handler(toWebRequest(event))
})
