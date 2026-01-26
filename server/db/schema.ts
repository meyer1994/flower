import { sql } from 'drizzle-orm'
import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import * as auth from './auth'

export * from './auth'

export const TItems = sqliteTable('items', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id')
    .notNull()
    .references(() => auth.user.id, { onDelete: 'cascade' }),
  name: text('name')
    .notNull(),
  createdAt: text('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdateFn(() => sql`CURRENT_TIMESTAMP`),
})

export const TTasks = sqliteTable('tasks', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  message: text('message')
    .notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => auth.user.id, { onDelete: 'cascade' }),
  status: text('status', { enum: ['SENDING', 'PENDING', 'RUNNING', 'ERRORED', 'FINISHED'] })
    .notNull()
    .default('PENDING'),
  error: text('error'),
  createdAt: text('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdateFn(() => sql`CURRENT_TIMESTAMP`),
})
