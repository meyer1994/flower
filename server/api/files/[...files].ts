import type { H3Event } from 'h3'
import z from 'zod'

type Bulider = typeof useFilesS3
type Provider = ReturnType<Bulider>

type Config = {
    buildProvider: typeof useFilesS3
    onRequest?: (event: H3Event) => Promise<void> | void
    onSuccess?: (event: H3Event) => Promise<void> | void
    onFinish?: (event: H3Event) => Promise<void> | void
    onError?: (event: H3Event, error: unknown) => Promise<void> | void
}


const PutSchema = z
.instanceof(FormData)
.transform(e => Object.fromEntries(e.entries()))
.pipe(z.object({ file: z.instanceof(File).refine(f => f.size > 0)}))


const handler = async (event: H3Event, provider: Provider) => {
  const key = event.context.params?.files
  if (!key) throw createError({ status: 404, message: 'File not found' })

  if (event.method === 'PUT') {
    const form = await readFormData(event)
    const result = PutSchema.safeParse(form)
    if (!result.success) throw createError({ status: 400, message: result.error.message })
    const buffer = await result.data.file.arrayBuffer()
    await provider.put(key, new Uint8Array(buffer))
    setResponseStatus(event, 201)
  }

  if (event.method === 'GET') {
    const { stream, meta } = await provider.get(key)
    setHeader(event, 'Content-Disposition', `attachment; filename="${encodeURIComponent(key)}"`)
    setHeader(event, 'Content-Type', meta.contentType || 'application/octet-stream')
    return stream
  }

  throw createError({ status: 405, message: `${event.method} is not allowed` })
}

const createFileHandler = (cfg: Config) => {
  return async (event: H3Event) => {
    try {
      await cfg.onRequest?.(event)
      const provider = cfg.buildProvider(event)
      const result = await handler(event, provider)
      await cfg.onSuccess?.(event)
      return result
    } catch (error) {
      await cfg.onError?.(event, error)
      throw error
    } finally {
      await cfg.onFinish?.(event)
     }
  }
}

export default createFileHandler({
  buildProvider: useFilesS3,
  onRequest: (event) => {
    console.log('onRequest')
  },
  onSuccess: (event) => {
    console.log('onSuccess')
  },
  onFinish: (event) => {
    console.log('onFinish')
  },
  onError: (event, error) => {
    console.error('onError', error)
  },
})