import { relations } from 'drizzle-orm'
import { boolean, integer, pgEnum, pgTable, text, uuid } from 'drizzle-orm/pg-core'
import { baseTable } from '../base-table'
import { docType } from './docs'

export const chats = pgTable('chats', {
  ...baseTable,
  title: text().notNull(),
  userId: text('user_id').notNull(),
  isPublic: boolean('public').notNull().default(false),
})

export const chatMessageRole = pgEnum('chats_message_role', [
  'system',
  'assistant',
  'user',
])

export const chatsMessages = pgTable('chats_messages', {
  ...baseTable,
  chatId: uuid('chat_id')
    .references(() => chats.id, { onDelete: 'cascade' })
    .notNull(),
  content: text().notNull(),
  role: chatMessageRole().notNull(),
  docTypes: docType('doc_types').array().notNull().default([]),
})

export const chatsMessagesSources = pgTable('chats_messages_sources', {
  id: baseTable.id,
  chatMessageId: uuid('chat_message_id')
    .references(() => chatsMessages.id, { onDelete: 'cascade' })
    .notNull(),
  url: text().notNull(),
  docType: docType('doc_type').notNull(),
  title: text().notNull(),
  match: integer().notNull(),
})

export const chatRelations = relations(chats, ({ many }) => ({
  messages: many(chatsMessages),
}))

export const chatMessagesRelations = relations(
  chatsMessages,
  ({ one, many }) => ({
    chat: one(chats, {
      fields: [chatsMessages.chatId],
      references: [chats.id],
    }),
    sources: many(chatsMessagesSources),
  }),
)

export const chatsMessagesSourcesRelations = relations(
  chatsMessagesSources,
  ({ one }) => ({
    chatMessage: one(chatsMessages, {
      fields: [chatsMessagesSources.chatMessageId],
      references: [chatsMessages.id],
    }),
  }),
)
