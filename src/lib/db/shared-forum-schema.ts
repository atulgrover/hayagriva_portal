import {
  pgTable,
  text,
  varchar,
  boolean,
  integer,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

export const communityThreads = pgTable("community_threads", {
  id: text("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  body: text("body").notNull(),
  authorId: text("author_id").default("guest").notNull(),
  authorName: varchar("author_name", { length: 255 }).notNull(),
  authorRole: varchar("author_role", { length: 50 }).default("GUEST").notNull(),
  authorAvatar: text("author_avatar"),
  category: varchar("category", { length: 100 }).default("insolvency-ibc").notNull(),
  originDomain: varchar("origin_domain", { length: 100 }).default("resolutionbazaar").notNull(),
  tags: jsonb("tags").default([]).notNull(),
  isPinned: boolean("is_pinned").default(false).notNull(),
  isLocked: boolean("is_locked").default(false).notNull(),
  hasAiAnswer: boolean("has_ai_answer").default(false).notNull(),
  aiStatus: varchar("ai_status", { length: 20 }).default("QUEUED").notNull(),
  replyCount: integer("reply_count").default(0).notNull(),
  viewsCount: integer("views_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const communityReplies = pgTable("community_replies", {
  id: text("id").primaryKey(),
  threadId: text("thread_id")
    .notNull()
    .references(() => communityThreads.id, { onDelete: "cascade" }),
  authorId: text("author_id").notNull(),
  authorName: varchar("author_name", { length: 255 }).notNull(),
  authorRole: varchar("author_role", { length: 50 }).default("AI_BOT").notNull(),
  authorAvatar: text("author_avatar"),
  body: text("body").notNull(),
  isAiGenerated: boolean("is_ai_generated").default(false).notNull(),
  aiCitations: jsonb("ai_citations").default([]).notNull(),
  upvotes: integer("upvotes").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const communityGuestRateLimits = pgTable("community_guest_rate_limits", {
  ipHash: varchar("ip_hash", { length: 64 }).primaryKey(),
  questionCount: integer("question_count").default(0).notNull(),
  lastQuestionAt: timestamp("last_question_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
});

export type CommunityThread = typeof communityThreads.$inferSelect;
export type NewCommunityThread = typeof communityThreads.$inferInsert;
export type CommunityReply = typeof communityReplies.$inferSelect;
export type NewCommunityReply = typeof communityReplies.$inferInsert;
export type CommunityGuestRateLimit = typeof communityGuestRateLimits.$inferSelect;
