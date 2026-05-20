import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export * from './auth'

export const TCounter = sqliteTable('counter', {
  id: text('id')
    .primaryKey(),
  count: integer('count')
    .notNull()
    .default(0),
})
