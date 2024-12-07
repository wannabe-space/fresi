DROP INDEX IF EXISTS "cosine_index";--> statement-breakpoint
ALTER TABLE "docs" ADD COLUMN "index" integer NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "embedding_index" ON "docs" USING hnsw ("embedding" vector_cosine_ops);