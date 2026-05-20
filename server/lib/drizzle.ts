import { createDatabase } from 'db0'
import cloudflareD1 from 'db0/connectors/cloudflare-d1'
import { drizzle, type DrizzleDatabase } from 'db0/integrations/drizzle'
import type { H3Event } from 'h3'
import type * as schema from '../db/schema'

const db0 = createDatabase(cloudflareD1({ bindingName: 'DB' }))
const db = drizzle(db0) as DrizzleDatabase<typeof schema>
export const serverDrizzle = (_event?: H3Event) => db
