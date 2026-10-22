import { neon } from "@neondatabase/serverless";

async function runMigration() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set");
  }

  const sql = neon(databaseUrl);

  console.log("Creating community_threads table...");
  await sql`
    CREATE TABLE IF NOT EXISTS community_threads (
      id text PRIMARY KEY NOT NULL,
      title varchar(255) NOT NULL,
      body text NOT NULL,
      author_id text NOT NULL,
      author_name varchar(255) NOT NULL,
      author_role varchar(50) NOT NULL,
      author_avatar text,
      category varchar(100) DEFAULT 'general' NOT NULL,
      tags jsonb DEFAULT '[]'::jsonb NOT NULL,
      is_pinned boolean DEFAULT false NOT NULL,
      is_locked boolean DEFAULT false NOT NULL,
      has_ai_answer boolean DEFAULT false NOT NULL,
      ai_status varchar(20) DEFAULT 'PENDING' NOT NULL,
      reply_count integer DEFAULT 0 NOT NULL,
      views_count integer DEFAULT 0 NOT NULL,
      created_at timestamp DEFAULT now() NOT NULL,
      updated_at timestamp DEFAULT now() NOT NULL
    );
  `;

  console.log("Creating community_replies table...");
  await sql`
    CREATE TABLE IF NOT EXISTS community_replies (
      id text PRIMARY KEY NOT NULL,
      thread_id text NOT NULL,
      author_id text NOT NULL,
      author_name varchar(255) NOT NULL,
      author_role varchar(50) NOT NULL,
      author_avatar text,
      body text NOT NULL,
      is_ai_generated boolean DEFAULT false NOT NULL,
      ai_citations jsonb DEFAULT '[]'::jsonb NOT NULL,
      upvotes integer DEFAULT 0 NOT NULL,
      created_at timestamp DEFAULT now() NOT NULL
    );
  `;

  console.log("✓ Community database tables successfully migrated to Neon PostgreSQL!");
}

runMigration().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
