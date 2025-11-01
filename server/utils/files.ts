import { GetObjectCommand, ListObjectsV2Command, PutObjectCommand, PutObjectCommandInput, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import type { H3Event } from 'h3'

type Body = PutObjectCommandInput['Body']
type Metadata = { contentType?: string }

export type FileMetadata = {
  key: string
  url?: string
  size?: number
  lastModified?: Date
}

export interface FileStorage {
  put(key: string, body: Body, meta?: Metadata): Promise<void>
  get(key: string): Promise<ReadableStream>
  url(key: string, opts: S3UrlOptions): Promise<string>
  list(): Promise<FileMetadata[]>
}

type S3StorageOptions = {
  bucket: string

  // NUXT_FILES_AWS_*
  awsEndpoint?: string // e.g., https://<accountid>.r2.cloudflarestorage.com
  awsAccessKeyId?: string
  awsSecretAccessKey?: string
  awsRegion?: string
}

type S3UrlOptions = {
  expiresIn?: number // seconds
}


export class S3Storage implements FileStorage {
  client: S3Client
  bucket: string

  constructor(opts: S3StorageOptions) {
    if (!opts.bucket) throw new Error('bucket is required')
    this.bucket = opts.bucket
    this.client = new S3Client({
      region: opts.awsRegion,
      endpoint: opts.awsEndpoint,
      credentials: {
        accessKeyId: opts.awsAccessKeyId || '',  // will fail if not set
        secretAccessKey: opts.awsSecretAccessKey || '', // will fail if not set
      },
      forcePathStyle: !!opts.awsEndpoint,
    })
  }

  /**
   * Put a file (Buffer/Uint8Array/string) to S3
   * @param key
   * @param body
   * @param meta.contentType
   */
  async put(key: string, body: Body, meta?: Metadata) {
    await this.client.send(new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: body,
      ContentType: meta?.contentType,
    }))
  }

  /**
   * Get file from S3
   * @param key
   */
  async get(key: string): Promise<ReadableStream> {
    const res = await this.client.send(new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    }))
    if (!res.Body) throw new Error('File not found')
    return res.Body.transformToWebStream()
  }


  /**
   * Get a presigned URL for reading or writing to S3
   * (Useful for direct browser uploads/downloads)
   * @param key
   * @param opts
   */
  async url(key: string, opts: S3UrlOptions = {}): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    })
    return await getSignedUrl(this.client, command, { 
      expiresIn: opts.expiresIn
    })
  }

  /**
   * List all objects in S3 bucket
   */
  async list(): Promise<FileMetadata[]> {
    const command = new ListObjectsV2Command({ Bucket: this.bucket })
    const response = await this.client.send(command)

    const items = response.Contents || []
    return await Promise.all(
      items.map(async (i) => ({
        key: i.Key || '',
        size: i.Size,
        lastModified: i.LastModified,
        url: await this.url(i.Key || ''),
      }))
    )
  }
}

export const useFilesS3 = (event?: H3Event) => {
  const config = useRuntimeConfig(event)
  return new S3Storage({
    bucket: config.files.s3.bucket,
    awsRegion: config.files.s3.region,
    awsEndpoint: config.files.s3.endpoint,
    awsAccessKeyId: config.files.s3.accessKeyId,
    awsSecretAccessKey: config.files.s3.secretAccessKey,
  })
}

type R2StorageOptions = {
  bucket: string
  r2Endpoint: string
  r2AccessKeyId: string
  r2SecretAccessKey: string
}

class R2Storage extends S3Storage {
  constructor(opts: R2StorageOptions) {
    super({
      bucket: opts.bucket,
      awsRegion: 'auto',
      awsEndpoint: opts.r2Endpoint,
      awsAccessKeyId: opts.r2AccessKeyId,
      awsSecretAccessKey: opts.r2SecretAccessKey,
    })
  }
}


// Helper to get R2Storage using runtime config
export const useFilesR2 = (event?: H3Event) => {
  const config = useRuntimeConfig(event)
  return new R2Storage({
    bucket: config.files.r2.bucket,
    r2AccessKeyId: config.files.r2.accessKeyId,
    r2SecretAccessKey: config.files.r2.secretAccessKey,
    r2Endpoint: config.files.r2.endpoint,
  })
}
