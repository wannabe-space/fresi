ALTER TABLE "chats_messages" ALTER COLUMN "doc_types" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "public"."chats_messages_sources" ALTER COLUMN "doc_type" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "public"."docs" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."doc_type";--> statement-breakpoint
CREATE TYPE "public"."doc_type" AS ENUM('react', 'vue', 'next', 'nuxt', 'drizzle-orm', 'prisma', 'tanstack-query');--> statement-breakpoint
ALTER TABLE "public"."chats_messages_sources" ALTER COLUMN "doc_type" SET DATA TYPE "public"."doc_type" USING "doc_type"::"public"."doc_type";--> statement-breakpoint
ALTER TABLE "public"."docs" ALTER COLUMN "type" SET DATA TYPE "public"."doc_type" USING "type"::"public"."doc_type";