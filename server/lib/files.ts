import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  S3Client,
} from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import type { H3Event } from 'h3'

type Input = string | Uint8Array | Buffer | Blob | File
type InputOptions = { mimeType?: string }

interface Storage {
  get: (key: string) => Promise<Uint8Array>
  put: (key: string, data: Input, opts: InputOptions) => Promise<void>
  list: (prefix?: string) => Promise<string[]>
  delete: (key: string) => Promise<void>
  url: (key: string, expiresIn?: number) => Promise<string>
}

export const useS3FileStorage = (event: H3Event): Storage => {
  const config = useRuntimeConfig(event)

  const s3 = new S3Client({
    region: config.files.region,
    credentials: {
      accessKeyId: config.files.accessKeyId,
      secretAccessKey: config.files.secretAccessKey,
    },
    endpoint: config.files.endpoint,
    forcePathStyle: !!config.files.endpoint,
  })

  const bucketName = config.files.bucket

  return {
    get: async (key: string) => {
      const command = new GetObjectCommand({ Bucket: bucketName, Key: key })
      const response = await s3.send(command)
      const arrayBuffer = await response.Body!.transformToByteArray()
      return new Uint8Array(arrayBuffer)
    },

    put: async (key: string, data: Input, opts: InputOptions = {}) => {
      const upload = new Upload({
        client: s3,
        params: {
          Bucket: bucketName,
          Key: key,
          Body: data,
          ContentType: opts.mimeType,
        },
      })
      await upload.done()
    },

    list: async (prefix?: string) => {
      const command = new ListObjectsV2Command({ Bucket: bucketName, Prefix: prefix })
      const response = await s3.send(command)
      const items = response.Contents?.map(item => item.Key).filter(Boolean) ?? []
      return items as string[]
    },

    delete: async (key: string) => {
      const command = new DeleteObjectCommand({ Bucket: bucketName, Key: key })
      await s3.send(command)
    },

    url: async (key: string, expiresIn: number = 3600) => {
      const command = new GetObjectCommand({ Bucket: bucketName, Key: key })
      return await getSignedUrl(s3, command, { expiresIn })
    },
  }
}

export const useR2FileStorage = (event: H3Event): Storage => {
  const config = useRuntimeConfig(event)
  const bucket = event.context.cloudflare?.env?.FILES as R2Bucket
  if (!bucket) throw new Error('Missing FILES binding')

  const bucketName = config.files.bucket

  // R2 uses S3-compatible API with the same AWS credentials
  // R2 requires 'auto' region and path-style addressing
  const s3 = new S3Client({
    region: 'auto', // R2 uses 'auto' as the region
    credentials: {
      accessKeyId: config.files.accessKeyId,
      secretAccessKey: config.files.secretAccessKey,
    },
    endpoint: config.files.endpoint,
    forcePathStyle: true, // R2 requires path-style addressing
  })

  return {
    get: async (key: string) => {
      const object = await bucket.get(key)
      if (!object) throw new Error(`Object ${key} not found`)
      const arrayBuffer = await object.arrayBuffer()
      return new Uint8Array(arrayBuffer)
    },

    put: async (key: string, data: Input, opts: InputOptions = {}) => {
      await bucket.put(key, data, {
        httpMetadata: { contentType: opts.mimeType },
      })
    },

    list: async (prefix?: string) => {
      const objects = await bucket.list({ prefix })
      return objects.objects.map(object => object.key)
    },

    delete: async (key: string) => {
      await bucket.delete(key)
    },

    url: async (key: string, expiresIn: number = 3600) => {
      // Bindings don't support pre-signed URLs, so we fall back to S3
      const command = new GetObjectCommand({ Bucket: bucketName, Key: key })
      return await getSignedUrl(s3, command, { expiresIn })
    },
  }
}

export const serverFiles = (event: H3Event): Storage => {
  if (import.meta.dev) return useS3FileStorage(event)
  return useR2FileStorage(event)
}
