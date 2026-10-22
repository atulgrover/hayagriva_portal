# In-Portal Community Discussions & Azure LightRAG Bot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a native in-portal threaded community board (`/dashboard/community`) with Tiptap legal markdown editing, shadcn/ui primitives, and an automated Azure LightRAG AI bot that provides sovereign legal analysis on `chats.agenticprofessionals.net`.

**Architecture:** Next.js 15 App Router + Drizzle ORM on Neon Serverless PostgreSQL with two new tables (`community_threads`, `community_replies`). New threads dispatch an asynchronous server task to `https://chats.agenticprofessionals.net/query`, which returns answers citing legal Bare Acts and automatically posts a pinned AI reply. The UI uses a split-view feed and Radix-based slide-over drawer with Tiptap rich editing.

**Tech Stack:** Next.js 15, React 19, TypeScript, Drizzle ORM, PostgreSQL (Neon), Tailwind CSS, Radix UI (shadcn primitives), Tiptap Editor (`@tiptap/react`), Lucide React.

**Spec:** [`docs/superpowers/specs/2026-10-22-community-discussions-lightrag-design.md`](file:///Users/atulgrover/Desktop/HAYAGRIVA%20PORTAL/docs/superpowers/specs/2026-10-22-community-discussions-lightrag-design.md)

## Global Constraints

- Database updates must be declared in `src/lib/db/schema.ts` and pushed via `npx drizzle-kit push`.
- All community API routes must authenticate sessions via `src/lib/auth.ts` (`getSession(req)`).
- The Azure LightRAG endpoint is fixed at `https://chats.agenticprofessionals.net/query`.
- Azure calls must be wrapped in an `AbortController` with a 35-second timeout window.
- All client UI components must use the existing shadcn design tokens (`bg-card`, `border-border`, `text-muted-foreground`, `cn()` from `@/lib/utils`).

## Review Focus

1. **Azure VM Timeout / Unreachability**: If `chats.agenticprofessionals.net` fails or times out, the thread must persist cleanly with `aiStatus = "FAILED"`, human community replies must remain functional, and an admin retry button must render.
2. **Double AI Trigger Prevention**: Creating a thread must spawn exactly one AI analysis task; duplicate clicks or rapid retries must be idempotent.
3. **Session Spoofing & Role Validation**: Non-authenticated users must be rejected with HTTP 401; the author ID and name stored on threads must match the active session.
4. **HTML/XSS Injection via Tiptap**: Thread and reply bodies containing raw script tags must be sanitized before rendering.
5. **Contextual `@ai` Thread Replies**: Replies mentioning `@ai` must correctly bundle previous thread messages into `conversation_history` before calling LightRAG.

---

### Task 1: Database Schema Expansion & Drizzle Synchronization

**Files:**
- Modify: `src/lib/db/schema.ts:200-230`
- Test: `src/tests/community_schema.test.ts`

**Interfaces:**
- Produces: `communityThreads` (Drizzle table), `communityReplies` (Drizzle table), types `CommunityThread`, `NewCommunityThread`, `CommunityReply`, `NewCommunityReply`.

- [ ] **Step 1: Write the failing test**
Create `src/tests/community_schema.test.ts` verifying that `communityThreads` and `communityReplies` exist in `@/lib/db/schema` with required columns (`id`, `title`, `body`, `authorId`, `category`, `hasAiAnswer`, `aiStatus`, `aiCitations`).
```typescript
import { communityThreads, communityReplies } from "../lib/db/schema";
import assert from "node:assert";

assert.ok(communityThreads, "communityThreads table should be defined");
assert.ok(communityReplies, "communityReplies table should be defined");
assert.ok(communityThreads.hasAiAnswer, "hasAiAnswer column should exist");
assert.ok(communityReplies.aiCitations, "aiCitations column should exist");
console.log("✓ Community schema definition test passed");
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npx tsx src/tests/community_schema.test.ts`
Expected: FAIL with "communityThreads is not exported from schema".

- [ ] **Step 3: Implement schema definitions in `src/lib/db/schema.ts`**
Add `communityThreads` and `communityReplies` tables and export their inferred types.

- [ ] **Step 4: Run test to verify it passes**
Run: `npx tsx src/tests/community_schema.test.ts`
Expected: PASS

- [ ] **Step 5: Synchronize schema to Neon PostgreSQL**
Run: `npx drizzle-kit push`
Expected: Output indicates `community_threads` and `community_replies` created in PostgreSQL.

- [ ] **Step 6: Commit**
```bash
git add src/lib/db/schema.ts src/tests/community_schema.test.ts
git commit -m "feat(db): add community_threads and community_replies schema"
```

---

### Task 2: Azure LightRAG Connector Service

**Files:**
- Create: `src/lib/services/lightrag.ts`
- Test: `src/tests/lightrag_service.test.ts`

**Interfaces:**
- Consumes: Azure endpoint `https://chats.agenticprofessionals.net/query`.
- Produces: `queryAzureLightRag(query: string, conversationHistory?: Array<{ role: string; content: string }>): Promise<{ answer: string; citations: Array<{ act: string; section?: string; title?: string }>; status: "SUCCESS" | "FAILED" }>`

- [ ] **Step 1: Write the failing test**
Create `src/tests/lightrag_service.test.ts` testing the request payload construction, timeout handling, and Bare Act citation extraction.
```typescript
import { parseLegalCitations, queryAzureLightRag } from "../lib/services/lightrag";
import assert from "node:assert";

const sampleText = "Under Section 12 of the Insolvency and Bankruptcy Code, 2016 (IBC), the CIRP must complete in 180 days. Regulation 35A requires avoidance audits.";
const citations = parseLegalCitations(sampleText);
assert.ok(citations.some(c => c.section === "12" || c.act.includes("IBC")), "Should detect Section 12 citation");
console.log("✓ Citation parser test passed");
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npx tsx src/tests/lightrag_service.test.ts`
Expected: FAIL with "Cannot find module ../lib/services/lightrag".

- [ ] **Step 3: Implement `src/lib/services/lightrag.ts`**
Implement:
- `parseLegalCitations(text: string)`: Regex-based extraction of legal sections (IBC, Section 7, 9, 12, 14, CIRP Regulations).
- `queryAzureLightRag(query, conversationHistory)`: `fetch` call with `AbortController` (35s timeout) to `https://chats.agenticprofessionals.net/query` returning `{ answer, citations, status }`.

- [ ] **Step 4: Run test to verify it passes**
Run: `npx tsx src/tests/lightrag_service.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add src/lib/services/lightrag.ts src/tests/lightrag_service.test.ts
git commit -m "feat(ai): implement Azure LightRAG connector with citation extractor"
```

---

### Task 3: Community API Route Handlers

**Files:**
- Create: `src/app/api/community/threads/route.ts`
- Create: `src/app/api/community/threads/[id]/route.ts`
- Create: `src/app/api/community/threads/[id]/replies/route.ts`
- Create: `src/app/api/community/threads/[id]/ai-retry/route.ts`
- Test: `src/tests/community_api.test.ts`

**Interfaces:**
- Consumes: `src/lib/auth.ts`, `communityThreads`, `communityReplies`, `queryAzureLightRag`.
- Produces: REST endpoints for thread list, thread creation, thread details, and replies.

- [ ] **Step 1: Write the failing test**
Create `src/tests/community_api.test.ts` testing:
1. Thread creation payload validation (requires `title` >= 5 chars, `body` >= 10 chars).
2. Category defaults to `"general"`.
3. Background AI reply insertion.
```typescript
import assert from "node:assert";
// Integration test against API helper logic
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npx tsx src/tests/community_api.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement API Routes**
- `src/app/api/community/threads/route.ts`:
  - `GET`: Queries `communityThreads` with category/search filters and pagination.
  - `POST`: Validates session, creates thread, initiates non-blocking background `queryAzureLightRag` call to create initial AI reply in `communityReplies`.
- `src/app/api/community/threads/[id]/route.ts`:
  - `GET`: Returns thread and all associated replies ordered by `createdAt ASC`.
- `src/app/api/community/threads/[id]/replies/route.ts`:
  - `POST`: Inserts user reply, increments thread `replyCount`. If reply body contains `@ai` or `@hayagriva`, triggers contextual follow-up.
- `src/app/api/community/threads/[id]/ai-retry/route.ts`:
  - `POST`: Manually triggers Azure LightRAG for a thread that had `aiStatus = "FAILED"`.

- [ ] **Step 4: Run test to verify it passes**
Run: `npx tsx src/tests/community_api.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add src/app/api/community/ src/tests/community_api.test.ts
git commit -m "feat(api): implement community threads, replies, and AI retry endpoints"
```

---

### Task 4: shadcn/ui Primitives & Tiptap Rich Legal Editor

**Files:**
- Create: `src/components/ui/badge.tsx`
- Create: `src/components/ui/button.tsx`
- Create: `src/components/ui/card.tsx`
- Create: `src/components/ui/sheet.tsx`
- Create: `src/components/ui/avatar.tsx`
- Create: `src/components/community/TiptapEditor.tsx`

**Interfaces:**
- Consumes: `cn` from `@/lib/utils`, `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-placeholder`.
- Produces: `<TiptapEditor content={value} onChange={setValue} placeholder="..." />`, `<Sheet>`, `<Badge>`, `<Button>`.

- [ ] **Step 1: Install required dependencies**
Run: `npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-placeholder @radix-ui/react-dialog @radix-ui/react-avatar @radix-ui/react-tabs`
Expected: Clean install in `package.json`.

- [ ] **Step 2: Create canonical shadcn/ui primitives**
Create `src/components/ui/badge.tsx`, `button.tsx`, `card.tsx`, `sheet.tsx`, `avatar.tsx` using `cn()` and existing Tailwind variables (`border-border`, `bg-card`, etc.).

- [ ] **Step 3: Implement `src/components/community/TiptapEditor.tsx`**
Build the rich text legal editor with toolbar buttons (Bold, Italic, List, Blockquote, Section `§` symbol, and Clear).

- [ ] **Step 4: Type-check components**
Run: `npx tsc --noEmit`
Expected: Zero TypeScript errors.

- [ ] **Step 5: Commit**
```bash
git add src/components/ui/ src/components/community/TiptapEditor.tsx package.json package-lock.json
git commit -m "feat(ui): add shadcn primitives and Tiptap legal rich text editor"
```

---

### Task 5: Community Board, Thread Cards & Slide-Over Drawer

**Files:**
- Create: `src/components/community/ThreadCard.tsx`
- Create: `src/components/community/AiReplyCard.tsx`
- Create: `src/components/community/ThreadDrawer.tsx`
- Create: `src/components/community/CommunityBoard.tsx`
- Create: `src/app/dashboard/community/page.tsx`
- Modify: `src/components/navigation/Sidebar.tsx` (add Community link)

**Interfaces:**
- Consumes: `GET /api/community/threads`, `POST /api/community/threads`, `GET /api/community/threads/[id]`, `POST /api/community/threads/[id]/replies`.
- Produces: Full community portal page mounted at `/dashboard/community`.

- [ ] **Step 1: Implement `ThreadCard.tsx` and `AiReplyCard.tsx`**
- `ThreadCard`: Shows category pill, title, body snippet, author name/role, creation time, `Has AI Answer` indicator, and reply count badge.
- `AiReplyCard`: Midnight blue/gold styled card with **"Verified AI Sovereign Analysis"** badge, citation chips, and copy action.

- [ ] **Step 2: Implement `ThreadDrawer.tsx`**
Slide-over drawer powered by Radix/shadcn Sheet:
- Original post at top.
- Pinned AI Analysis.
- Community comments stream.
- Tiptap editor at bottom for posting replies.

- [ ] **Step 3: Implement `CommunityBoard.tsx` and `/dashboard/community/page.tsx`**
- Category filter bar (`All`, `IBC & CIRP`, `Commercial Pleading`, `Desktop Harness`, `Bare Acts`).
- Search input with debounce.
- `+ New Discussion` modal with Tiptap editor.
- Thread list with responsive grid/list view.

- [ ] **Step 4: Add Community Link to Dashboard Navigation**
Modify [`src/components/navigation/Sidebar.tsx`](file:///Users/atulgrover/Desktop/HAYAGRIVA%20PORTAL/src/components) or Header to include a `MessageSquare` icon linking to `/dashboard/community`.

- [ ] **Step 5: Compile and verify build**
Run: `npx tsc --noEmit`
Expected: Clean pass with 0 errors.

- [ ] **Step 6: Commit**
```bash
git add src/components/community/ src/app/dashboard/community/ src/components/navigation/
git commit -m "feat(portal): implement community discussion board and slide-over drawer"
```

---

### Task 6: End-to-End Verification & Azure LightRAG Integration Test

**Files:**
- Create: `src/tests/community_e2e.test.ts`

- [ ] **Step 1: Write integration verification script**
Test the complete live flow against the running Next.js dev server:
1. `GET http://localhost:3300/api/community/threads` (verifies endpoint returns 200).
2. Create test thread via API: *"Section 14 Moratorium on personal guarantors"*.
3. Verify thread appears in list with `aiStatus = "PENDING"` or `"COMPLETED"`.
4. Poll until AI reply is populated from Azure LightRAG.
5. Verify reply contains citations for Section 14 / IBC.

- [ ] **Step 2: Execute verification test**
Run: `npx tsx src/tests/community_e2e.test.ts`
Expected: Output confirms all steps passed with live HTTP 200 responses.

- [ ] **Step 3: Browser visual validation**
Verify `/dashboard/community` renders cleanly on `http://localhost:3300/dashboard/community` with dark theme styling, working Tiptap editor, and slide-over drawer.

- [ ] **Step 4: Commit**
```bash
git add src/tests/community_e2e.test.ts
git commit -m "test: add community e2e and Azure LightRAG verification test suite"
```
