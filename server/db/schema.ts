import type { JSONContent } from '@tiptap/core'
import { desc, sql } from 'drizzle-orm'
import { index, integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { uuidv7 } from 'uuidv7'

export * from './auth'

export const TContent = sqliteTable('content',
  {
    id: text('id')
      .notNull()
      .$default(() => uuidv7()),
    body: text('body', { mode: 'json' })
      .notNull()
      .$type<JSONContent>()
      .$default(() => ({ type: 'doc', content: [] })),
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

export const TChatMessage = sqliteTable('chat_message',
  {
    id: text('id')
      .notNull()
      .$default(() => uuidv7()),
    // Chat session grouping key
    chatId: text('chat_id')
      .notNull()
      .$default(() => uuidv7()),
    role: text('role', { enum: ['user', 'assistant'] })
      .notNull(),
    text: text('text')
      .notNull(),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .notNull()
      .$default(() => sql`CURRENT_TIMESTAMP`),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
      .notNull()
      .$default(() => sql`CURRENT_TIMESTAMP`)
      .$onUpdateFn(() => sql`CURRENT_TIMESTAMP`),
  },
  t => [
    primaryKey({ columns: [t.chatId, t.id] }),
    index('idx_chat_message_chat_id_created_at').on(t.chatId, desc(t.createdAt)),
  ],
)
