import { serverAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const auth = serverAuth(event)
  return await auth.handler(toWebRequest(event))
})
