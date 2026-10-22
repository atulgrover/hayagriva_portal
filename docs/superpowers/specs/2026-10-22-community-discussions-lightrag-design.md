# Technical Design Specification: In-Portal Community Discussions & Azure LightRAG Bot

- **Document Date**: 2026-10-22
- **Topic**: In-Portal Threaded Community Board with Azure LightRAG AI Bot
- **Target File**: `docs/superpowers/specs/2026-10-22-community-discussions-lightrag-design.md`
- **Status**: Approved for Implementation Planning

---

## 1. Executive Summary & Intent

### Problem
Currently, users of the Hayagriva Sovereign AI Suite (advocates, insolvency professionals, and chamber associates) are redirected to an external Zulip Cloud workspace for community discussions and AI query resolution. This creates multiple points of friction:
1. **User Drop-off**: Forcing legal professionals off the portal breaks user immersion and requires separate account management.
2. **Cognitive Overhead**: Zulip's "Streams and Topics" model is confusing for non-technical practitioners.
3. **Loss of Sovereign Control**: Community discussions and practitioner legal insights should live securely within the Hayagriva ecosystem.

### Solution
Build an **In-Portal Threaded Community Board** inside the Hayagriva Portal (`/dashboard/community`) built on **shadcn/ui primitives** and the **Tiptap rich legal editor**, backed by an automated **Azure LightRAG AI Bot** querying the 64k-node commercial law knowledge graph at `https://chats.agenticprofessionals.net`.

---

## 2. Architecture & Data Flow

```
Advocate in Portal (/dashboard/community)
       │
       │ 1. Posts legal question via Tiptap Editor
       ▼
Next.js Route Handler (`POST /api/community/threads`)
       │
       ├─► 2. Persists thread in PostgreSQL (`community_threads`)
       │      Returns HTTP 201 immediately (Instant client UI update)
       │
       └─► 3. Asynchronously dispatches request to Azure LightRAG
              Target: `https://chats.agenticprofessionals.net/query`
              Payload: { query, mode: "mix", response_type: "Multiple Paragraphs" }
                     │
                     ▼
       Azure VM (Standard_B2ts_v2 in Central India)
       PostgreSQL 16 `lightrag_db` (64,116 Entity Nodes, 89,847 Relations)
                     │
                     ▼
       Returns structured legal analysis + Bare Act citations
                     │
                     ▼
       4. Inserts into `community_replies`:
          - `authorId: "system_lightrag_bot"`
          - `authorRole: "AI_BOT"`
          - `isAiGenerated: true`
          - `aiCitations`: parsed section chips
          - Updates `community_threads.hasAiAnswer = true`
                     │
                     ▼
Advocate Thread Drawer displays Golden Verified Sovereign Analysis badge
```

---

## 3. Database Schema (Drizzle ORM)

File: `src/lib/db/schema.ts`

### 3.1. `community_threads` Table
```typescript
export const communityThreads = pgTable("community_threads", {
  id: text("id").primaryKey(), // th_xxxx
  title: varchar("title", { length: 255 }).notNull(),
  body: text("body").notNull(), // HTML / structured markdown from Tiptap
  authorId: text("author_id").notNull(), // foreign key to users.id
  authorName: varchar("author_name", { length: 255 }).notNull(),
  authorRole: varchar("author_role", { length: 50 }).notNull(), // ADVOCATE, CLIENT, ADMIN, SUPER_ADMIN
  authorAvatar: text("author_avatar"),
  category: varchar("category", { length: 100 }).default("general").notNull(), // insolvency-ibc, commercial-pleading, desktop-harness, general
  tags: jsonb("tags").default([]).notNull(), // ["Section 12", "CIRP"]
  isPinned: boolean("is_pinned").default(false).notNull(),
  isLocked: boolean("is_locked").default(false).notNull(),
  hasAiAnswer: boolean("has_ai_answer").default(false).notNull(),
  aiStatus: varchar("ai_status", { length: 20 }).default("PENDING").notNull(), // PENDING, COMPLETED, FAILED, SKIPPED
  replyCount: integer("reply_count").default(0).notNull(),
  viewsCount: integer("views_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
```

### 3.2. `community_replies` Table
```typescript
export const communityReplies = pgTable("community_replies", {
  id: text("id").primaryKey(), // rep_xxxx
  threadId: text("thread_id").notNull(), // references communityThreads.id
  authorId: text("author_id").notNull(), // user ID or "system_lightrag_bot"
  authorName: varchar("author_name", { length: 255 }).notNull(),
  authorRole: varchar("author_role", { length: 50 }).notNull(), // ADVOCATE, CLIENT, SUPER_ADMIN, AI_BOT
  authorAvatar: text("author_avatar"),
  body: text("body").notNull(),
  isAiGenerated: boolean("is_ai_generated").default(false).notNull(),
  aiCitations: jsonb("ai_citations").default([]).notNull(), // [{"act": "IBC 2016", "section": "12", "title": "Time-limit for completion of insolvency"}]
  upvotes: integer("upvotes").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

---

## 4. Azure LightRAG Bot Pipeline

### 4.1. Endpoint Target & Protocol
- **Host**: `https://chats.agenticprofessionals.net/query`
- **Method**: `POST`
- **Headers**:
  - `Content-Type: application/json`
  - `User-Agent: HayagrivaPortal/1.0`
- **Request Body**:
```json
{
  "query": "string (thread title + body)",
  "mode": "mix",
  "response_type": "Multiple Paragraphs",
  "conversation_history": []
}
```

### 4.2. Response Parsing & Extraction
The LightRAG response payload contains the generated response text and retrieved context chunks. The integration service parses:
1. **Body**: The main synthesized legal explanation.
2. **Citations**: Automatically detects Bare Act references (e.g., Section 7, Section 9, Section 12, Regulation 35A) into structured tags.
3. **Persistence**: Saves into `community_replies` with `isAiGenerated = true`.

### 4.3. Follow-up `@ai` Mentions in Replies
When any community member replies with `@ai` or `@hayagriva`:
1. The route detects the mention tag.
2. Queries the last 5 messages from `community_replies` for this thread.
3. Builds the `conversation_history` array `[{ role: "user" | "assistant", content: "..." }]`.
4. Sends the contextual follow-up query to Azure LightRAG.

---

## 5. UI/UX Design & Component Hierarchy (shadcn/ui + Tiptap)

### 5.1. Route & Navigation
- Page URL: `/dashboard/community`
- Navigation item added in [`src/components/navigation/Sidebar.tsx`](file:///Users/atulgrover/Desktop/HAYAGRIVA%20PORTAL/src/components) and [`src/components/client/header.tsx`](file:///Users/atulgrover/Desktop/HAYAGRIVA%20PORTAL/src/components/client/header.tsx).

### 5.2. Component Breakdown
1. **`src/components/ui/` (Formal shadcn Primitives)**:
   - `button.tsx`: Unified action buttons (default, outline, gold variant).
   - `badge.tsx`: Category & citation chips (`IBC 2016`, `AI Verified`).
   - `card.tsx`: Discussion card container.
   - `sheet.tsx`: Radix-based sliding drawer for active thread view.
   - `avatar.tsx`: User initials / Hayagriva bot medallion.
   - `input.tsx`: Search input.
   - `tabs.tsx`: Category filter switcher.

2. **`src/components/community/` (Domain Components)**:
   - `CommunityBoard.tsx`: Main split container (Feed on left, drawer on right).
   - `ThreadCard.tsx`: Compact feed item showing title, author, time, and reply count.
   - `ThreadDrawer.tsx`: Slides out from right; displays original post, pinned AI analysis, and comment stream.
   - `TiptapEditor.tsx`: Headless legal rich text editor (`@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-placeholder`).
   - `AiReplyCard.tsx`: Dedicated card styling for `Hayagriva Sovereign Bot` with amber/gold accents and citation pill list.

---

## 6. API Route Contracts

### 6.1. `GET /api/community/threads`
- **Query Params**:
  - `category` (optional, string): Filter by category slug.
  - `search` (optional, string): Case-insensitive search on title and body.
  - `limit` (default: 20, max: 50).
  - `page` (default: 1).
- **Response**:
```json
{
  "threads": [
    {
      "id": "th_a1b2c3d4",
      "title": "CIRP timeline extensions under Section 12 during litigation",
      "bodySnippet": "Does the 330-day timeline exclude days spent in NCLAT appeal...",
      "authorName": "Adv. Rajesh Sharma",
      "authorRole": "ADVOCATE",
      "category": "insolvency-ibc",
      "tags": ["Section 12", "CIRP"],
      "hasAiAnswer": true,
      "replyCount": 3,
      "createdAt": "2026-10-22T10:15:00Z"
    }
  ],
  "total": 42,
  "page": 1,
  "totalPages": 3
}
```

### 6.2. `POST /api/community/threads`
- **Body**: `{ "title": "...", "body": "...", "category": "...", "tags": [...] }`
- **Auth**: Requires valid session token (`src/lib/auth.ts`).
- **Response**: `HTTP 201` with created thread object.

### 6.3. `GET /api/community/threads/[id]`
- **Response**: Full thread details + chronological list of `replies`.

### 6.4. `POST /api/community/threads/[id]/replies`
- **Body**: `{ "body": "..." }`
- **Auth**: Requires valid session token.
- **Triggers**: If body includes `@ai`, dispatches Azure LightRAG query in background.

---

## 7. Error Handling & Resilience

1. **Azure VM Timeout & Fallback**:
   - Azure API call wrapped in an `AbortController` with a 35-second timeout.
   - If timeout or HTTP 5xx occurs:
     - Logged in `system_logs`.
     - `community_threads.aiStatus` updated to `"FAILED"`.
     - Thread remains fully functional for human community members.
     - An **`"Ask AI Bot"`** retry button is rendered on the UI for authors/admins.
2. **HTML Sanitization**:
   - Tiptap outputs sanitized HTML. Server validates and strips unsafe script tags before saving to PostgreSQL.
3. **Optimistic Thread Drawer**:
   - When a user submits a reply, it appears optimistically in the thread drawer with a pending checkmark.

---

## 8. Verification & Test Plan

1. **Database Migration**:
   - Execute `npx drizzle-kit push` to synchronize Neon PostgreSQL with the two new tables.
2. **API Endpoint Test Suite**:
   - Create automated test script `src/tests/community_api.test.ts`.
   - Validate thread creation, retrieval, validation rules, and reply appending.
3. **Azure LightRAG Connector Test**:
   - Test script sending a sample CIRP query to `https://chats.agenticprofessionals.net/query` and verifying legal citations in response.
4. **End-to-End Browser Walkthrough**:
   - Start Next.js dev server on port 3300.
   - Log into portal as `atulgroverr@gmail.com`.
   - Navigate to `/dashboard/community`.
   - Verify empty state or existing thread list.
   - Create a test thread using Tiptap: *"Section 14 Moratorium applicability on personal guarantors"*.
   - Verify drawer displays typing indicator and populates AI reply with citations.

---

## 9. Future Roadmap Hooks
- **Phase 2 (Practitioner Blogs & Insights)**: Add `isArticle: boolean` to threads for long-form case analysis published to the public portal.
- **Phase 3 (Agent Marketplace)**: Connect `custom_agents` and `hub_items` to community discussions for one-click cartridge downloads directly from discussion recommendations.
