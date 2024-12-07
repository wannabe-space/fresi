CREATE TYPE "public"."chats_message_role" AS ENUM('system', 'assistant', 'user');--> statement-breakpoint
CREATE TYPE "public"."resource" AS ENUM('react', 'vue', 'next', 'nuxt', 'drizzle-orm', 'prisma', 'tanstack-query');--> statement-breakpoint
CREATE TYPE "public"."subscription_type" AS ENUM('monthly', 'yearly');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "chats" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"title" text NOT NULL,
	"user_id" text NOT NULL,
	"public" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "chats_messages" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"chat_id" uuid NOT NULL,
	"content" text NOT NULL,
	"role" "chats_message_role" NOT NULL,
	"resources" resource[] DEFAULT '{}' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "chats_messages_sources" (
	"id" uuid PRIMARY KEY NOT NULL,
	"chat_message_id" uuid NOT NULL,
	"url" text NOT NULL,
	"resource" "resource" NOT NULL,
	"title" text NOT NULL,
	"match" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "docs" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"path" text NOT NULL,
	"resource" "resource" NOT NULL,
	"url" text NOT NULL,
	"title" text NOT NULL,
	"slug" text,
	"content" text NOT NULL,
	"embedding" vector(1536) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "subscriptions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"user_id" text NOT NULL,
	"stripe_customer_id" text NOT NULL,
	"stripe_subscription_id" text NOT NULL,
	"data" jsonb NOT NULL,
	"type" "subscription_type" NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chats_messages" ADD CONSTRAINT "chats_messages_chat_id_chats_id_fk" FOREIGN KEY ("chat_id") REFERENCES "public"."chats"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chats_messages_sources" ADD CONSTRAINT "chats_messages_sources_chat_message_id_chats_messages_id_fk" FOREIGN KEY ("chat_message_id") REFERENCES "public"."chats_messages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "cosine_index" ON "docs" USING hnsw ("embedding" vector_cosine_ops);
