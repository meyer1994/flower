import { desc, sql } from 'drizzle-orm'
import { index, integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { uuidv7 } from 'uuidv7'

export * from './auth'

export const TContent = sqliteTable('content',
  {
    id: text('id')
      .notNull()
      .$default(() => uuidv7()),
    body: text('body')
      .notNull()
      .$default(() => ''),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .notNull()
      .$default(() => sql`CURRENT_TIMESTAMP`),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
      .notNull()
      .$default(() => sql`CURRENT_TIMESTAMP`)
      .$onUpdateFn(() => sql`CURRENT_TIMESTAMP`),
  },
  t => [
    primaryKey({ columns: [t.id, t.createdAt] }),
    index('idx_content_id_created_at').on(desc(t.id), desc(t.createdAt)),
  ],
)
