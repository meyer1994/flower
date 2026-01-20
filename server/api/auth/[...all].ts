import { serverAuth } from '~~/server/auth/auth'

export default defineEventHandler((event) => {
  return serverAuth(event).handler(toWebRequest(event))
})
