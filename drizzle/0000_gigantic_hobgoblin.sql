CREATE TABLE "activations" (
	"id" text PRIMARY KEY NOT NULL,
	"license_id" text NOT NULL,
	"user_id" text NOT NULL,
	"hardware_fingerprint" varchar(64) NOT NULL,
	"device_name" varchar(100) NOT NULL,
	"os_info" varchar(100) NOT NULL,
	"domain" varchar(50) DEFAULT 'LEGAL_DISPUTE',
	"ip_address" varchar(45) NOT NULL,
	"last_ping_at" timestamp DEFAULT now() NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"activated_at" timestamp DEFAULT now() NOT NULL,
	"deactivated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "admin_audit_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"admin_id" text NOT NULL,
	"admin_email" varchar(255) NOT NULL,
	"action" varchar(100) NOT NULL,
	"target_user_id" text,
	"previous_state" jsonb,
	"new_state" jsonb,
	"ip_address" varchar(45) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "api_keys" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"activation_id" text,
	"name" varchar(100) NOT NULL,
	"key_prefix" varchar(25) NOT NULL,
	"key_hash" text NOT NULL,
	"scopes" jsonb NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"last_used_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "asset_downloads" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"asset_type" varchar(50) NOT NULL,
	"asset_key" varchar(100) NOT NULL,
	"file_size_bytes" numeric,
	"ip_address" varchar(45) NOT NULL,
	"downloaded_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "community_replies" (
	"id" text PRIMARY KEY NOT NULL,
	"thread_id" text NOT NULL,
	"author_id" text NOT NULL,
	"author_name" varchar(255) NOT NULL,
	"author_role" varchar(50) NOT NULL,
	"author_avatar" text,
	"body" text NOT NULL,
	"is_ai_generated" boolean DEFAULT false NOT NULL,
	"ai_citations" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"upvotes" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "community_threads" (
	"id" text PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"body" text NOT NULL,
	"author_id" text NOT NULL,
	"author_name" varchar(255) NOT NULL,
	"author_role" varchar(50) NOT NULL,
	"author_avatar" text,
	"category" varchar(100) DEFAULT 'general' NOT NULL,
	"tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"is_pinned" boolean DEFAULT false NOT NULL,
	"is_locked" boolean DEFAULT false NOT NULL,
	"has_ai_answer" boolean DEFAULT false NOT NULL,
	"ai_status" varchar(20) DEFAULT 'PENDING' NOT NULL,
	"reply_count" integer DEFAULT 0 NOT NULL,
	"views_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "custom_agents" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"slug" varchar(100) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"archetype" varchar(50) NOT NULL,
	"version" varchar(20) DEFAULT '1.0.0' NOT NULL,
	"system_prompt" text NOT NULL,
	"reasoning_effort" varchar(20) DEFAULT 'medium' NOT NULL,
	"allow_subagents" boolean DEFAULT true NOT NULL,
	"critic_agent" varchar(50),
	"statutory_vaults" jsonb NOT NULL,
	"slash_triggers" jsonb NOT NULL,
	"medallion_color" varchar(20) DEFAULT '#f59e0b' NOT NULL,
	"cartridge_url" text,
	"cartridge_hash" varchar(64),
	"downloads_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "device_sync_queue" (
	"id" text PRIMARY KEY NOT NULL,
	"license_key" varchar(255) NOT NULL,
	"hardware_fingerprint" varchar(255),
	"hub_item_id" varchar(255) NOT NULL,
	"status" varchar(50) DEFAULT 'QUEUED' NOT NULL,
	"action" varchar(50) DEFAULT 'INSTALL' NOT NULL,
	"priority" varchar(50) DEFAULT 'NORMAL' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"delivered_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "download_telemetry" (
	"id" serial PRIMARY KEY NOT NULL,
	"platform" varchar(50) NOT NULL,
	"app_version" varchar(50) NOT NULL,
	"country_code" varchar(10) DEFAULT 'IN' NOT NULL,
	"city" varchar(100),
	"ip_hash" varchar(64) NOT NULL,
	"downloaded_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hub_items" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"org_id" varchar(255),
	"urn" varchar(255),
	"domain" varchar(100) DEFAULT 'legal-dispute' NOT NULL,
	"subdomain" varchar(100) DEFAULT 'corporate-insolvency' NOT NULL,
	"archetype" varchar(100),
	"item_type" varchar(50) NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"visibility" varchar(50) DEFAULT 'PUBLIC' NOT NULL,
	"verified" boolean DEFAULT false NOT NULL,
	"downloads" integer DEFAULT 0 NOT NULL,
	"tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"required_skills" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"statutory_vaults" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"manifest" jsonb NOT NULL,
	"import_id" varchar(255),
	"author_name" varchar(255) DEFAULT 'MintplexLabs',
	"author_url" text,
	"image_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invoices" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"user_name" varchar(255) NOT NULL,
	"user_email" varchar(255) NOT NULL,
	"amount_inr" numeric(10, 2) NOT NULL,
	"status" varchar(50) DEFAULT 'PAID' NOT NULL,
	"plan_tier" varchar(50) NOT NULL,
	"pdf_url" text,
	"issued_at" timestamp DEFAULT now() NOT NULL,
	"paid_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "licenses" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"license_key" varchar(64) NOT NULL,
	"plan_tier" varchar(50) DEFAULT 'PROFESSIONAL' NOT NULL,
	"domain" varchar(50) DEFAULT 'LEGAL_DISPUTE',
	"max_devices" integer DEFAULT 3 NOT NULL,
	"status" varchar(50) DEFAULT 'ACTIVE' NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "licenses_license_key_unique" UNIQUE("license_key")
);
--> statement-breakpoint
CREATE TABLE "support_tickets" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"user_name" varchar(255) NOT NULL,
	"user_email" varchar(255) NOT NULL,
	"subject" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"priority" varchar(50) DEFAULT 'MEDIUM' NOT NULL,
	"status" varchar(50) DEFAULT 'OPEN' NOT NULL,
	"admin_response" text,
	"responded_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "system_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text,
	"method" varchar(10) NOT NULL,
	"endpoint" varchar(255) NOT NULL,
	"status_code" integer NOT NULL,
	"response_time_ms" integer NOT NULL,
	"ip_address" varchar(45) NOT NULL,
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" text NOT NULL,
	"role" varchar(50) DEFAULT 'ADVOCATE' NOT NULL,
	"status" varchar(50) DEFAULT 'ACTIVE' NOT NULL,
	"plan" varchar(50) DEFAULT 'STARTER' NOT NULL,
	"org" varchar(255),
	"avatar_url" text,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp,
	"deleted_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
