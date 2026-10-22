# Shared Design Tokens & Portal Look-and-Feel Harmonization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish a shared design token contract (`design-tokens.css`) across both website and portal, and systematically harmonize all portal UI components, pages, sidebars, headers, cards, tables, and modals to the bold minimal black/white/grey shadcn design system with zero feature or logic changes.

**Architecture:** Shared CSS custom properties in `design-tokens.css` (mirrored in `HAYAGRIVA WEBSITE/css/` and `HAYAGRIVA PORTAL/src/app/`) define typography, shadcn slate neutrals, 12px card radiuses, and 6px button radiuses. Next.js loads Inter and JetBrains Mono fonts. Tailwind CSS variables map directly to the token contract. UI primitives (`Button`, `Card`, `Badge`, `Tabs`) and all 5 portal zones are systematically swept to eradicate fragmented amber/color fills in favor of clean high-contrast monochrome with restrained live status indicators.

**Tech Stack:** Vanilla CSS3, Next.js 14 (App Router), Tailwind CSS, TypeScript, Lucide Icons, Shadcn UI Primitives, Tiptap Editor.

**Spec:** `docs/superpowers/specs/2026-10-22-shared-design-tokens-and-portal-harmonization-design.md`

---

## Global Constraints
- Zero feature or business logic changes: All database schemas, API routes, authentication cookies, form validation, and query parameters remain completely intact.
- Fonts: `Inter` for sans headings/body; `JetBrains Mono` for tags, badges, code, numbers.
- Palette: Strict Shadcn Slate neutrals (Slate-50 `#f8fafc` to Slate-950 `#020617`). Zero saturated amber/blue card borders or button fills.
- Geometry: `12px` card corner radius (`rounded-xl`), `6px` button corner radius (`rounded-md`).
- Primary buttons: Solid high-contrast deep slate `#0f172a` (light mode) / pure white `#ffffff` (dark mode).
- Status indicators: Clean outline pill with 6px live dot indicator (emerald for active/live, slate for idle/pending, gold for verified).

---

## Review Focus
- Dark Mode / Light Mode Contrast: Switching between light and dark themes must preserve high contrast on text, card borders, and buttons without washed-out greys.
- Split-Screen Auth Continuity: Visiting `/login` must immediately feel like an extension of the website's 5-pillar cards.
- Community Board & Tiptap Editor: Discussions, replies, and drawer remain clean, legible, and functional with zero toolbar styling regressions.
- Hub & Garuda Cards: 3-column minimal grid aligns with website `.pillar-teaser-grid`.
- Automated Tests: All 5 test suites (`npm test`) pass without failure.

---

## File Structure & Responsibilities

| File Path | Action | Role / Responsibility |
|---|---|---|
| `src/app/design-tokens.css` | Create | Portal canonical token contract (typography, slate palette, radiuses, shadows). |
| `/Users/atulgrover/Desktop/HAYAGRIVA WEBSITE/css/design-tokens.css` | Create | Website mirrored token contract. |
| `HAYAGRIVA WEBSITE/*.html` | Modify | Import `css/design-tokens.css` in website pages. |
| `src/app/layout.tsx` | Modify | Load Inter and JetBrains Mono fonts; configure slate selection styling. |
| `src/app/globals.css` | Modify | Import `design-tokens.css`; map `:root` and `.dark` variables to tokens. |
| `tailwind.config.ts` | Modify | Map `fontFamily` to CSS variables; map semantic colors to slate neutrals. |
| `src/components/ui/button.tsx` | Modify | High-contrast monochrome default, crisp outline, deprecate amber fill. |
| `src/components/ui/card.tsx` | Modify | Enforce `rounded-xl` (12px), subtle slate borders, hover lift. |
| `src/components/ui/badge.tsx` | Modify | Monochrome outline badges with 6px status dots. |
| `src/components/ui/tabs.tsx` | Modify | Minimal border pill/underline tab triggers. |
| `src/app/login/page.tsx` | Modify | Split auth: 4 feature cards with `01`–`04` monospace tags; monochrome tabs/buttons. |
| `src/components/navigation/UnifiedNavbar.tsx` | Modify | Monochrome logo mark, muted icons, slate active tab states. |
| `src/components/navigation/HeaderControls.tsx` | Modify | Slate dropdowns and icon triggers. |
| `src/components/client/header.tsx` & `sidebar.tsx` | Modify | 56px glassmorphism header; slate sidebar with monochrome icons. |
| `src/components/admin/header.tsx` & `sidebar.tsx` | Modify | Synchronize admin navigation with slate design tokens. |
| `src/app/dashboard/page.tsx` | Modify | Remove amber fills/borders; typographic `.haya` packages, hardware seats. |
| `src/app/dashboard/workspace/page.tsx` & `licenses/page.tsx` | Modify | Monospace license cards, clean copy actions, slate device cards. |
| `src/components/community/CommunityBoard.tsx` | Modify | Minimal topic pills, slate search bar, monochrome new discussion dialog. |
| `src/components/community/ThreadCard.tsx` | Modify | Typographic thread cards, hover lift, subtle AI badge. |
| `src/components/community/ThreadDrawer.tsx` & `AiReplyCard.tsx` | Modify | Slate drawer, legal AI reply with monospace citation tags. |
| `src/components/community/TiptapEditor.tsx` | Modify | Slate toolbar border and clean focus rings. |
| `src/components/hub/*.tsx` (8 files) | Modify | Rebuild Garuda agent cards to 3-column minimal grid; monochrome dialogs. |
| `src/components/agents/*.tsx` (3 files) | Modify | Agent Studio archetype cards transformed to executive legal cards. |
| `src/components/admin/*.tsx` (10 files) | Modify | Admin KPI metrics, users table, user drawer, ticket modals. |

---

## Tasks

### Task 1: Create Shared Design Token Contract (`design-tokens.css`) in Both Repositories

**Files:**
- Create: `src/app/design-tokens.css` (Portal)
- Create: `/Users/atulgrover/Desktop/HAYAGRIVA WEBSITE/css/design-tokens.css` (Website)
- Modify: `HAYAGRIVA WEBSITE/index.html`, `context.html`, `knowledge.html`, `intelligence.html`, `agents.html`, `community.html`

- [ ] **Step 1: Write `src/app/design-tokens.css` in Portal**
  Define `:root` and `.dark` variables with exact typography (`--font-sans`, `--font-mono`), slate neutrals (`--slate-50` through `--slate-950`), semantic surfaces, `12px` card radius, and `6px` button radius.
- [ ] **Step 2: Copy `design-tokens.css` to `HAYAGRIVA WEBSITE/css/design-tokens.css`**
  Ensure byte-for-byte identical token definitions.
- [ ] **Step 3: Add `<link rel="stylesheet" href="css/design-tokens.css">` to website HTML files**
  Insert right before `css/main.css` across all 5 pillar pages and `index.html`.
- [ ] **Step 4: Verify website pages load tokens with zero console errors on `http://localhost:5050`**
- [ ] **Step 5: Commit Task 1**
  ```bash
  git add src/app/design-tokens.css
  git commit -m "feat(tokens): create shared design tokens contract"
  ```

---

### Task 2: Configure Fonts, Tailwind & Semantic Variables in Portal

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`
- Modify: `tailwind.config.ts`

- [ ] **Step 1: Update `src/app/layout.tsx`**
  Import `Inter` and `JetBrains_Mono` from `next/font/google`. Apply `inter.variable` and `jetbrainsMono.variable` to `html`/`body`. Replace selection highlight with `selection:bg-slate-900 selection:text-white dark:selection:bg-slate-100 dark:selection:text-slate-950`.
- [ ] **Step 2: Update `src/app/globals.css`**
  Import `./design-tokens.css` at top. Bind CSS variables (`--background`, `--foreground`, `--card`, `--border`, `--muted`, `--primary`) directly to the slate tokens for `:root` and `.dark`. Set `body { font-family: var(--font-sans); }`.
- [ ] **Step 3: Update `tailwind.config.ts`**
  Add `fontFamily: { sans: ['var(--font-sans)', 'sans-serif'], mono: ['var(--font-mono)', 'monospace'] }`.
- [ ] **Step 4: Verify Next.js dev server compiles without errors on `http://localhost:3300`**
- [ ] **Step 5: Commit Task 2**
  ```bash
  git add src/app/layout.tsx src/app/globals.css tailwind.config.ts
  git commit -m "feat(theme): configure Inter and JetBrains Mono fonts and slate tailwind tokens"
  ```

---

### Task 3: Refactor Core UI Primitives (`button`, `card`, `badge`, `tabs`)

**Files:**
- Modify: `src/components/ui/button.tsx`
- Modify: `src/components/ui/card.tsx`
- Modify: `src/components/ui/badge.tsx`
- Modify: `src/components/ui/tabs.tsx`

- [ ] **Step 1: Update `src/components/ui/button.tsx`**
  Set `default` variant to `bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 font-semibold shadow-xs`. Update `outline` to `border border-border bg-background hover:bg-secondary text-foreground`. Deprecate solid amber button fills.
- [ ] **Step 2: Update `src/components/ui/card.tsx`**
  Ensure container uses `rounded-xl border border-border bg-card text-card-foreground shadow-xs`.
- [ ] **Step 3: Update `src/components/ui/badge.tsx`**
  Standardize badges to clean outline pills with subtle slate backgrounds. Implement live dot indicators (`w-1.5 h-1.5 rounded-full inline-block mr-1.5`).
- [ ] **Step 4: Update `src/components/ui/tabs.tsx`**
  Ensure tabs triggers use crisp minimal slate borders and subtle active indicators.
- [ ] **Step 5: Commit Task 3**
  ```bash
  git add src/components/ui/
  git commit -m "feat(ui): refactor button, card, badge, and tabs to minimal slate primitives"
  ```

---

### Task 4: Harmonize Navigation Shells & Split-Screen Auth

**Files:**
- Modify: `src/app/login/page.tsx`
- Modify: `src/components/navigation/UnifiedNavbar.tsx`
- Modify: `src/components/navigation/HeaderControls.tsx`
- Modify: `src/components/client/header.tsx` & `src/components/client/sidebar.tsx`
- Modify: `src/components/admin/header.tsx` & `src/components/admin/sidebar.tsx`

- [ ] **Step 1: Refactor `src/app/login/page.tsx`**
  Style left 4 feature cards with `rounded-xl`, `border-border`, monospace `01`–`04` tags, bold slate titles, and muted descriptions. Update right-side tab switcher, inputs, and button to monochrome standard.
- [ ] **Step 2: Update `UnifiedNavbar.tsx` & `HeaderControls.tsx`**
  Replace amber ॐ icon with dark slate / monochrome emblem. Set active tab to `bg-secondary text-foreground font-semibold`. Mute icon colors. Update `⌘K` search badge to `font-mono`.
- [ ] **Step 3: Update `ClientSidebar` & `ClientHeader`**
  Enforce slate background, monochrome section titles (`font-mono text-[10px] tracking-wider uppercase text-muted-foreground`), and active navigation link state.
- [ ] **Step 4: Update `AdminSidebar` & `AdminHeader`**
  Align admin layout shells with the identical slate navigation styles.
- [ ] **Step 5: Verify `/login` and portal navigation visually on `http://localhost:3300/login`**
- [ ] **Step 6: Commit Task 4**
  ```bash
  git add src/app/login/page.tsx src/components/navigation/ src/components/client/ src/components/admin/
  git commit -m "feat(nav): harmonize split auth and navigation shells with minimal slate aesthetic"
  ```

---

### Task 5: Harmonize Client Dashboard Pages & Modals

**Files:**
- Modify: `src/app/dashboard/page.tsx`
- Modify: `src/app/dashboard/workspace/page.tsx`
- Modify: `src/app/dashboard/licenses/page.tsx`
- Modify: `src/app/dashboard/billing/page.tsx`
- Modify: `src/app/dashboard/support/page.tsx`
- Modify: `src/components/client/create-ticket-modal.tsx`
- Modify: `src/components/client/generate-key-modal.tsx`
- Modify: `src/components/client/deactivate-modal.tsx`
- Modify: `src/components/client/transfer-seat-modal.tsx`

- [ ] **Step 1: Refactor `src/app/dashboard/page.tsx`**
  Purge all `border-amber-500/30`, `bg-amber-500/15 text-amber-500`, and `bg-amber-500` buttons. Rebuild Sovereign Agent Packages into clean typographic cards with `font-mono` version tags and high-contrast download CTA. Device seats use clean emerald/slate dot indicators.
- [ ] **Step 2: Refactor `workspace/page.tsx` & `licenses/page.tsx`**
  Format license keys in `font-mono text-xs`, clean copy actions, and slate hardware binding cards.
- [ ] **Step 3: Refactor `billing/page.tsx` & `support/page.tsx`**
  Format invoices and tickets into clean data tables with 1px slate gridlines and monochrome status pills.
- [ ] **Step 4: Refactor Client Modals**
  Update modal dialogs in `src/components/client/` to use slate borders, muted headers, and monochrome buttons.
- [ ] **Step 5: Verify `http://localhost:3300/dashboard` in browser subagent**
- [ ] **Step 6: Commit Task 5**
  ```bash
  git add src/app/dashboard/ src/components/client/
  git commit -m "feat(dashboard): purge amber fills and harmonize client dashboard pages"
  ```

---

### Task 6: Harmonize Community Discussions Board & Tiptap Editor

**Files:**
- Modify: `src/components/community/CommunityBoard.tsx`
- Modify: `src/components/community/ThreadCard.tsx`
- Modify: `src/components/community/ThreadDrawer.tsx`
- Modify: `src/components/community/AiReplyCard.tsx`
- Modify: `src/components/community/TiptapEditor.tsx`

- [ ] **Step 1: Refactor `CommunityBoard.tsx`**
  Update topic category pills to minimal outline buttons (`border-border text-muted-foreground`, active: `bg-foreground text-background font-semibold`). Update search input and new discussion modal to slate tokens.
- [ ] **Step 2: Refactor `ThreadCard.tsx`**
  Remove amber borders and halos. Apply `hover:border-slate-300 dark:hover:border-slate-700 hover:-translate-y-0.5 hover:shadow-md`. Refine AI status badge to subtle monochrome or slate pill with sparkle.
- [ ] **Step 3: Refactor `ThreadDrawer.tsx` & `AiReplyCard.tsx`**
  Update drawer container to `bg-card border-l border-border`. Format AI reply card with crisp slate border, legal citations rendered in `font-mono text-xs`.
- [ ] **Step 4: Refactor `TiptapEditor.tsx`**
  Enforce 1px slate toolbar divider, clean active formatting button states (`bg-secondary`), and focus ring.
- [ ] **Step 5: Run community test suite to verify zero logic regressions**
  ```bash
  npm test src/tests/community_api.test.ts src/tests/community_e2e.test.ts
  ```
  Expected: All tests pass.
- [ ] **Step 6: Commit Task 6**
  ```bash
  git add src/components/community/
  git commit -m "feat(community): harmonize community board, thread cards, and tiptap editor"
  ```

---

### Task 7: Harmonize Garuda Hub Marketplace & Agent Studio

**Files:**
- Modify: `src/app/hub/page.tsx`
- Modify: `src/components/hub/ItemCard.tsx`
- Modify: `src/components/hub/CategoryTabs.tsx`
- Modify: `src/components/hub/TaxonomySidebar.tsx`
- Modify: `src/components/hub/ItemDetailModal.tsx`
- Modify: `src/components/hub/PublishModal.tsx`
- Modify: `src/components/hub/FleetSyncModal.tsx`
- Modify: `src/components/hub/ManifestCodeViewer.tsx`
- Modify: `src/components/agents/ArchetypeCard.tsx`
- Modify: `src/components/agents/BuilderAccordion.tsx`
- Modify: `src/components/agents/SandboxCanvas.tsx`

- [ ] **Step 1: Refactor `ItemCard.tsx` & `CategoryTabs.tsx` in Hub**
  Rebuild agent cards to 3-column minimal grid matching website `.pillar-teaser-grid`. Remove amber fills; use monochrome category tags and high-contrast buttons.
- [ ] **Step 2: Refactor Hub Modals & Manifest Viewer**
  Format `ManifestCodeViewer.tsx` with clean `font-mono` slate container; clean modal actions.
- [ ] **Step 3: Refactor Agent Studio in `src/components/agents/`**
  Transform `ArchetypeCard.tsx`, `BuilderAccordion.tsx`, and `SandboxCanvas.tsx` from colored boxes to executive typographic cards.
- [ ] **Step 4: Verify `http://localhost:3300/hub` and `/dashboard/agents` in browser subagent**
- [ ] **Step 5: Commit Task 7**
  ```bash
  git add src/app/hub/ src/components/hub/ src/components/agents/
  git commit -m "feat(hub): harmonize garuda catalog and agent studio components"
  ```

---

### Task 8: Harmonize Super Admin Control Center

**Files:**
- Modify: `src/app/admin/dashboard/page.tsx`
- Modify: `src/components/admin/metrics-card.tsx`
- Modify: `src/components/admin/revenue-chart.tsx`
- Modify: `src/components/admin/activity-stream.tsx`
- Modify: `src/components/admin/users-table.tsx`
- Modify: `src/components/admin/user-view-drawer.tsx`
- Modify: `src/components/admin/user-edit-form.tsx`
- Modify: `src/components/admin/ticket-resolution-modal.tsx`
- Modify: `src/components/admin/soft-delete-modal.tsx`

- [ ] **Step 1: Refactor `metrics-card.tsx` & `admin/dashboard/page.tsx`**
  KPI metrics styled with bold numerals (`text-2xl font-bold tracking-tight text-foreground`), slate borders, and subtle trend badges.
- [ ] **Step 2: Refactor `users-table.tsx` & `user-view-drawer.tsx`**
  Table rows with 1px slate gridlines, clean slate header row, and monochrome actions.
- [ ] **Step 3: Refactor Admin Modals**
  Update `ticket-resolution-modal.tsx` and `soft-delete-modal.tsx` to slate tokens.
- [ ] **Step 4: Verify `http://localhost:3300/admin/dashboard` in browser subagent**
- [ ] **Step 5: Commit Task 8**
  ```bash
  git add src/app/admin/ src/components/admin/
  git commit -m "feat(admin): harmonize super admin center and metrics components"
  ```

---

### Task 9: Full Automated Test Suite & Visual Regression Matrix

**Files:**
- Test: All 5 test suites
- Inspect: Browser views across website and portal

- [ ] **Step 1: Run all automated tests**
  ```bash
  npm test
  ```
  Expected: 5 passing suites, 0 failures.
- [ ] **Step 2: Run Next.js build / typecheck**
  ```bash
  npm run build
  ```
  Expected: Zero compilation errors, clean bundle.
- [ ] **Step 3: Execute visual verification matrix in browser subagent**
  Compare `http://localhost:5050` (Website) with:
  1. `http://localhost:3300/login`
  2. `http://localhost:3300/dashboard`
  3. `http://localhost:3300/dashboard/community`
  4. `http://localhost:3300/hub`
  5. `http://localhost:3300/admin/dashboard`
  in both Light and Dark modes. Confirm font weights, card radiuses, border contrasts, and button weights are completely seamless.
- [ ] **Step 4: Final commit and summary**
  ```bash
  git commit --allow-empty -m "chore: complete look-and-feel harmonization across website and portal"
  ```
