import { GetObjectCommand, ListObjectsV2Command, PutObjectCommand, PutObjectCommandInput, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import type { H3Event } from 'h3'

type Body = PutObjectCommandInput['Body']
type Metadata = { contentType?: string }

export type FileMetadata = {
  key: string
  size?: number
  lastModified?: Date
}

interface Storage {
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


export class S3Storage {
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
    return await this.client.send(new PutObjectCommand({
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
    const command = new ListObjectsV2Command({
      Bucket: this.bucket,
    })
    const response = await this.client.send(command)
    return (response.Contents || []).map((item) => ({
      key: item.Key || '',
      size: item.Size,
      lastModified: item.LastModified,
    }))
  }
}

export const useFilesS3 = (event?: H3Event) => {
  const config = useRuntimeConfig(event)
  return new S3Storage({
    bucket: config.files.aws.bucket,
    awsRegion: config.files.aws.region,
    awsEndpoint: config.files.aws.endpoint,
    awsAccessKeyId: config.files.aws.accessKeyId,
    awsSecretAccessKey: config.files.aws.secretAccessKey,
  })
}

export const useFilesR2 = (event?: H3Event) => {
  return useFilesS3(event)
}