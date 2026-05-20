import {
  defineConfig,
} from 'drizzle-kit'

export default defineConfig({
  strict: true,
  verbose: true,
  dialect: 'sqlite',
  schema: './server/db/schema.ts',
  out: './server/db/migrations',
  // we dont need the dbCredentials here because the migrations are handled by
  // `wrangler d1 migrations apply`
  // dbCredentials: { url: process.env.DATABASE_URL },
})
