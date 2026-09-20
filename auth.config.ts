import { drizzle } from 'drizzle-orm/sql-js'
import { globSync } from 'node:fs'
import * as pathLib from 'node:path'
import * as schema from './server/db/schema'
import { createAuth } from './server/lib/auth'

const [firstMatch] = globSync('.wrangler/**/*D1DatabaseObject*/**/*.sqlite')
console.log('sqlite file', firstMatch)
const path = firstMatch ? `file:${pathLib.resolve(firstMatch)}` : ''
const db = drizzle(path, { schema })

export const auth = createAuth(db)
