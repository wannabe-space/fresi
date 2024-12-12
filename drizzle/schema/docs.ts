import { index, integer, pgEnum, pgTable, text, vector } from 'drizzle-orm/pg-core'
import { baseTable } from '../base-table'

export const docType = pgEnum('doc_type', [
  'react',
  'vue',
  'svelte',
  'next',
  'nuxt',
  'tailwindcss',
  'swiper',
  'hono',
  'drizzle-orm',
  'prisma',
  'tanstack-query',
  'tanstack-router',
  'better-auth',
  'aisdk',
])

export const docs = pgTable('docs', {
  ...baseTable,
  path: text().notNull(),
  type: docType().notNull(),
  url: text().notNull(),
  title: text().notNull(),
  content: text().notNull(),
  embedding: vector({ dimensions: 1536 }).notNull(),
  index: integer().notNull(),
}, table => ({
  embeddingIndex: index('embedding_index').using('hnsw', table.embedding.op('vector_cosine_ops')),
}))
