# Hayagriva Website Shared IBC Forum Integration Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a top-level `● ibc forum` navigation tab to `hayagriva_website` and deploy a public statutory Q&A discussion board connected to the shared Singapore Neon database, 3 questions/day guest IP rate limiting, and Azure LightRAG knowledge graph.

**Architecture:** The forum client on `hayagriva_website` (`community.html`) and the public route on `hayagriva_portal` (`/forum`) both connect to the shared Singapore Neon PostgreSQL pooler. Guest inquiries pass silent Turnstile verification and server-side SHA-256 IP rate limiting (3/day limit). Queries trigger an asynchronous call to Azure LightRAG (`chats.agenticprofessionals.net`) with `X-API-Key`, auto-inserting the sovereign AI reply and statutory Bare Act citations.

**Tech Stack:** 
- `hayagriva_website`: Vanilla HTML5, CSS3, ES Modules, Chakra Petch typography, Feather/FontAwesome icons.
- `hayagriva_portal`: Next.js 14 App Router, Drizzle ORM, Neon Serverless PostgreSQL (`ap-southeast-1`), Tailwind CSS, Radix UI.
- AI & Backend: Azure LightRAG (`chats.agenticprofessionals.net`), Cloudflare Turnstile.

**Spec:** `docs/superpowers/specs/2026-10-27-shared-frontend-forum-lightrag-design.md`

## Global Constraints
- **Timezone:** All timestamps MUST display strictly in Indian Standard Time (IST / `Asia/Kolkata`) across both websites.
- **Shared DB:** Both Resolution Bazaar and Agentic Professionals MUST use the exact Singapore Neon pooled connection string: `postgresql://neondb_owner:npg_hfx1TLRcS5aD@ep-curly-meadow-b30a75yb-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require`.
- **LightRAG Auth:** Azure LightRAG calls MUST send `X-API-Key: 20b8aa6253d9e09e9c70417d4938f8c7` and omit `Authorization: Bearer`.
- **Rate Limit:** Unauthenticated guests get 3 questions/day based on SHA-256 hashed IP with rolling 24h reset before prompting for login.
- **Domain Tagging:** Threads created from Agentic Professionals MUST record `origin_domain = "agenticprofessionals"`.

## Review Focus
- **RF-1 (No CORS Block on Website API Calls):** Static `community.html` on `localhost:5050` or `agenticprofessionals.net` must successfully query the API without CORS errors.
- **RF-2 (Header Uniformity):** The new `● ibc forum` tab must render consistently in both `header.html` and dynamic `js/header.js` fallback HTML across all 25+ pages.
- **RF-3 (Active State Highlight):** Visiting `community.html` or `/community` must highlight the `● ibc forum` tab with active styling.
- **RF-4 (Zero Impact to Existing Website Pages):** `knowledge.html`, `intelligence.html`, `counsels.html`, and `professionals.html` must remain 100% operational with no layout shift or visual breakage.
- **RF-5 (Cross-Site Sync):** A question asked on `hayagriva_website` must immediately appear on `resolutionbazaar/forum` and vice-versa.

---

### Task 1: Connect `hayagriva_portal` to Shared Neon DB & Enable Public Guest Queries

**Files:**
- Modify: `/Users/atulgrover/Desktop/HAYAGRIVA PORTAL/.env.local`
- Create: `/Users/atulgrover/Desktop/HAYAGRIVA PORTAL/src/lib/db/shared-forum-schema.ts`
- Create: `/Users/atulgrover/Desktop/HAYAGRIVA PORTAL/src/lib/db/shared-forum.ts`
- Create: `/Users/atulgrover/Desktop/HAYAGRIVA PORTAL/src/lib/services/rate-limiter.ts`
- Create: `/Users/atulgrover/Desktop/HAYAGRIVA PORTAL/src/lib/services/turnstile.ts`
- Modify: `/Users/atulgrover/Desktop/HAYAGRIVA PORTAL/src/app/api/community/threads/route.ts`
- Test: `/Users/atulgrover/Desktop/HAYAGRIVA PORTAL/src/tests/shared_forum_guest.test.ts`

- [ ] **Step 1: Write the test verifying shared DB connection and guest rate limiting in `HAYAGRIVA PORTAL`**
- [ ] **Step 2: Add `SHARED_FORUM_DATABASE_URL_POOLED` to `HAYAGRIVA PORTAL/.env.local`**
- [ ] **Step 3: Port `shared-forum.ts`, `shared-forum-schema.ts`, `rate-limiter.ts`, and `turnstile.ts` into `HAYAGRIVA PORTAL`**
- [ ] **Step 4: Update `src/app/api/community/threads/route.ts` to allow guest posts with CORS headers for static site origins**
- [ ] **Step 5: Run test and verify it passes**
- [ ] **Step 6: Git commit changes in `HAYAGRIVA PORTAL`**

---

### Task 2: Create Public `/forum` Route in `hayagriva_portal`

**Files:**
- Create: `/Users/atulgrover/Desktop/HAYAGRIVA PORTAL/src/app/forum/page.tsx`
- Create: `/Users/atulgrover/Desktop/HAYAGRIVA PORTAL/src/components/community/DailyLimitModal.tsx`
- Modify: `/Users/atulgrover/Desktop/HAYAGRIVA PORTAL/src/components/community/CommunityBoard.tsx`
- Test: `/Users/atulgrover/Desktop/HAYAGRIVA PORTAL/src/tests/public_forum_page.test.ts`

- [ ] **Step 1: Write test for public forum page rendering without authentication redirect**
- [ ] **Step 2: Port `DailyLimitModal.tsx` into `HAYAGRIVA PORTAL/src/components/community/`**
- [ ] **Step 3: Update `CommunityBoard.tsx` in `HAYAGRIVA PORTAL` to support guest posting with 3 questions/day warning modal**
- [ ] **Step 4: Create `src/app/forum/page.tsx` with full SEO title and meta description**
- [ ] **Step 5: Verify build succeeds (`npm run build`) in `HAYAGRIVA PORTAL`**
- [ ] **Step 6: Git commit changes in `HAYAGRIVA PORTAL`**

---

### Task 3: Add `● ibc forum` Navigation Tab to `hayagriva_website`

**Files:**
- Modify: `/Users/atulgrover/Desktop/HAYAGRIVA WEBSITE/header.html`
- Modify: `/Users/atulgrover/Desktop/HAYAGRIVA WEBSITE/js/header.js`
- Modify: `/Users/atulgrover/Desktop/HAYAGRIVA WEBSITE/css/header.css`
- Modify: `/Users/atulgrover/Desktop/HAYAGRIVA WEBSITE/render.yaml`

- [ ] **Step 1: Update `header.html` in `HAYAGRIVA WEBSITE` to add `● ibc forum` between `professionals` and `login`**
- [ ] **Step 2: Update `js/header.js` fallback HTML and `updateActiveNav()` to highlight `nav-forum` when on `community.html` or `/community`**
- [ ] **Step 3: Update `css/header.css` with green live pulse dot (`@keyframes pulse-emerald`) and hover styling**
- [ ] **Step 4: Update `render.yaml` so `/community` maps to `/community.html`**
- [ ] **Step 5: Verify all website pages show the new tab without layout shift**
- [ ] **Step 6: Git commit changes in `HAYAGRIVA WEBSITE`**

---

### Task 4: Deploy Sovereign Community Forum on `hayagriva_website` (`community.html`)

**Files:**
- Modify: `/Users/atulgrover/Desktop/HAYAGRIVA WEBSITE/community.html`
- Create: `/Users/atulgrover/Desktop/HAYAGRIVA WEBSITE/js/community_forum.js`
- Create: `/Users/atulgrover/Desktop/HAYAGRIVA WEBSITE/css/community_forum.css`

- [ ] **Step 1: Replace redirect in `community.html` with sovereign forum structure (header, filter pills, search input, thread grid, slide-over drawer, inquiry modal)**
- [ ] **Step 2: Create `css/community_forum.css` matching the site's Cobalt Slate (`#0b1f3b`) and Chakra Petch design system**
- [ ] **Step 3: Implement `js/community_forum.js` to fetch threads from shared API, render AI Answer badges, citations, IST timestamps, drawer opening, and guest thread submission**
- [ ] **Step 4: Add guest rate limit checking and daily limit modal**
- [ ] **Step 5: Verify `http://localhost:5050/community.html` loads and renders threads from shared Neon DB**
- [ ] **Step 6: Git commit changes in `HAYAGRIVA WEBSITE`**

---

### Task 5: End-to-End Verification & Cross-Domain Synchronization

**Files:**
- Cross-repo verification across `HAYAGRIVA WEBSITE`, `HAYAGRIVA PORTAL`, and `RESOLUTION BAZAAR`

- [ ] **Step 1: Post inquiry on `hayagriva_website` (port 5050)**
- [ ] **Step 2: Confirm Azure LightRAG responds with Bare Act citations and status `COMPLETED`**
- [ ] **Step 3: Refresh `http://localhost:3000/forum` (Resolution Bazaar) and verify the thread appears with `origin_domain = "agenticprofessionals"`**
- [ ] **Step 4: Verify timestamp renders in Indian Standard Time (IST) on both sites**
- [ ] **Step 5: Run browser subagent to capture recording of both sites interacting with the shared forum**
- [ ] **Step 6: Push `main` in `hayagriva_website` and `hayagriva_portal` to GitHub**
