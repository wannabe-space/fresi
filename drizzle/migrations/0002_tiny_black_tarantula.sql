ALTER TYPE "public"."resource" RENAME TO "doc_type";--> statement-breakpoint
ALTER TABLE "docs" RENAME COLUMN "resource" TO "type";--> statement-breakpoint
ALTER TABLE "chats_messages" ALTER COLUMN "resources" SET DATA TYPE doc_type[];