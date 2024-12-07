ALTER TABLE "chats_messages" RENAME COLUMN "resources" TO "docTypes";--> statement-breakpoint
ALTER TABLE "chats_messages_sources" RENAME COLUMN "resource" TO "docType";