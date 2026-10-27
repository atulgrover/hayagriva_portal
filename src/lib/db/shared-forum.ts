import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./shared-forum-schema";

const connectionString =
  process.env.SHARED_FORUM_DATABASE_URL_POOLED ||
  process.env.SHARED_FORUM_DATABASE_URL ||
  "postgresql://neondb_owner:npg_hfx1TLRcS5aD@ep-curly-meadow-b30a75yb-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

const sql = neon(connectionString);
export const sharedDb = drizzle(sql, { schema });

export * from "./shared-forum-schema";
