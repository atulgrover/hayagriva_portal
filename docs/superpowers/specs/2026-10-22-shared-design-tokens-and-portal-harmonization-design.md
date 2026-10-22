# Shared Design Tokens & Portal Look-and-Feel Harmonization Design

**Date:** 2026-10-22  
**Status:** Approved  
**Author:** Pair Programming Session with Superpowers  
**Scope:** Look & Feel Harmonization between `HAYAGRIVA WEBSITE` and `HAYAGRIVA PORTAL`  

---

## 1. Executive Summary & Intent

### 1.1 Goal
Unify the visual look and feel between the **Hayagriva Website** (`HAYAGRIVA WEBSITE`) and the **Hayagriva Portal** (`HAYAGRIVA PORTAL`) so that entering the portal from the marketing website feels completely seamless, native, and cohesive.

The website features a bold, minimal, typographic, executive aesthetic based on high-contrast black, white, and slate neutrals (Shadcn Slate/Zinc style) with zero loud pastel icon boxes or garish gradients. The portal currently contains fragmented amber/yellow/blue accents, uncalibrated dark mode hues, and inconsistent card geometries.

This design establishes a **Shared Design Token Layer (`design-tokens.css`)** as the single source of truth and sweeps the portal across all its pages and components to establish strict visual continuity.

### 1.2 Non-Goals & Boundaries
- **Zero Feature or Logic Changes:** No database schemas, API routes, authentication cookies, business logic, form validation rules, or telemetry services will be altered.
- **Strictly Look & Feel:** Modifications are strictly confined to CSS tokens, typography font families, border radii, card padding, and Tailwind color mappings.

---

## 2. Architecture: Shared Design Tokens Contract (`design-tokens.css`)

### 2.1 File Location & Symmetry
The single source of truth for all visual tokens is `design-tokens.css`. It is mirrored identically in both projects:
- **Website:** `css/design-tokens.css` (linked in `<head>` of all 5 pillar pages and `index.html`).
- **Portal:** `src/app/design-tokens.css` (imported at the top of `src/app/globals.css`).

### 2.2 Token Specifications
```css
/* ==========================================================================
   AgenticProfessionals.Net & Hayagriva Portal - Shared Design Tokens
   Theme: Bold Minimal High-Contrast Executive (Shadcn Slate Palette)
   ========================================================================== */

:root {
  /* 1. Typography */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Icons", "Segoe UI", Roboto, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* 2. Canonical Shadcn Slate Neutral Palette */
  --slate-50:  #f8fafc;
  --slate-100: #f1f5f9;
  --slate-200: #e2e8f0;
  --slate-300: #cbd5e1;
  --slate-400: #94a3b8;
  --slate-500: #64748b;
  --slate-600: #475569;
  --slate-700: #334155;
  --slate-800: #1e293b;
  --slate-900: #0f172a;
  --slate-950: #020617;

  /* 3. Light Mode Semantic Variables */
  --background: 210 40% 98%;          /* #f8fafc (slate-50) */
  --foreground: 222.2 84% 4.9%;        /* #020617 (slate-950) */
  --card: 0 0% 100%;                  /* #ffffff (pure white) */
  --card-foreground: 222.2 84% 4.9%;   /* #020617 */
  --popover: 0 0% 100%;               /* #ffffff */
  --popover-foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;       /* #0f172a (deep slate-900 CTA) */
  --primary-foreground: 210 40% 98%;   /* #f8fafc */
  --secondary: 210 40% 96.1%;         /* #f1f5f9 (slate-100) */
  --secondary-foreground: 222.2 47.4% 11.2%;
  --muted: 210 40% 96.1%;             /* #f1f5f9 */
  --muted-foreground: 215.4 16.3% 46.9%; /* #475569 (slate-600) */
  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;        /* #e2e8f0 (slate-200) */
  --input: 214.3 31.8% 91.4%;
  --ring: 222.2 84% 4.9%;

  /* 4. Geometry & Elevation */
  --radius: 0.75rem;                  /* 12px card corner radius */
  --radius-sm: 0.375rem;              /* 6px button corner radius */
  --shadow-xs: 0 1px 2px rgba(15, 23, 42, 0.04);
  --shadow-sm: 0 1px 3px rgba(15, 23, 42, 0.06), 0 1px 2px -1px rgba(15, 23, 42, 0.06);
  --shadow-md: 0 4px 6px -1px rgba(15, 23, 42, 0.07), 0 2px 4px -2px rgba(15, 23, 42, 0.05);
}

.dark {
  /* Dark Mode Semantic Variables (Deep Obsidian Slate) */
  --background: 222.2 84% 4.9%;       /* #020617 (slate-950) */
  --foreground: 210 40% 98%;          /* #f8fafc (slate-50) */
  --card: 222.2 47.4% 11.2%;          /* #0f172a (slate-900 surface) */
  --card-foreground: 210 40% 98%;
  --popover: 222.2 47.4% 11.2%;
  --popover-foreground: 210 40% 98%;
  --primary: 210 40% 98%;             /* #f8fafc (white CTA in dark) */
  --primary-foreground: 222.2 47.4% 11.2%; /* #0f172a */
  --secondary: 217.2 32.6% 17.5%;     /* #1e293b (slate-800) */
  --secondary-foreground: 210 40% 98%;
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%; /* #94a3b8 (slate-400) */
  --accent: 217.2 32.6% 17.5%;
  --accent-foreground: 210 40% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 210 40% 98%;
  --border: 217.2 32.6% 17.5%;        /* #1e293b (slate-800) */
  --input: 217.2 32.6% 17.5%;
  --ring: 212.7 26.8% 83.9%;
}
```

---

## 3. UI Primitives & Visual Components

### 3.1 Button Component (`src/components/ui/button.tsx`)
- **Default Variant:** High-contrast solid monochrome.
  - Light mode: `bg-slate-900 text-white hover:bg-slate-800 shadow-sm`.
  - Dark mode: `dark:bg-slate-50 dark:text-slate-950 dark:hover:bg-slate-200`.
  - Exactly matches the website's `.portal-cta-main` class.
- **Secondary / Outline Variant:** Crisp 1px slate border (`border-border bg-background hover:bg-secondary/70 text-foreground`).
- **Destructive Variant:** Restrained crimson text on subtle crimson tinted background (`bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20`).
- **Deprecate Amber Fills:** Eliminate solid `bg-amber-500` buttons across the entire portal; replace with `variant="default"` (solid high-contrast black/white) or `variant="outline"`.

### 3.2 Card Component (`src/components/ui/card.tsx`)
- Standardized to `rounded-xl` (12px), matching `.pillar-teaser-card`.
- 1px border (`border-border`), subtle elevation shadow (`shadow-sm`).
- Hover motion: `hover:border-slate-300 dark:hover:border-slate-700 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200`.
- Card headers utilize `font-mono` numbered tags (`01`, `02`, `03`) and uppercase category headers.

### 3.3 Badge & Status Indicator (`src/components/ui/badge.tsx`)
- Standardize all badges to clean outline pills with subtle slate backgrounds.
- Relegate colors to a tiny 6px dot indicator:
  - Active / Live / In-Session: Emerald dot (`bg-emerald-500`).
  - Flagship / Verified / Statute: Subtle gold dot (`bg-amber-500`) or monochrome icon.
  - Idle / Offline / Pending: Slate dot (`bg-slate-400`).

---

## 4. Zone-by-Zone Harmonization Inventory (~50 Files)

### 4.1 Zone 1: Navigation & Global Shells (6 Files)
- **`src/components/navigation/UnifiedNavbar.tsx` & `HeaderControls.tsx`:**
  - Replace saturated amber ॐ box with clean monochrome slate/white logo icon.
  - Active navigation tab styled with `bg-secondary text-foreground font-semibold shadow-xs` with subtle border.
  - Mute navigation icon colors to `text-muted-foreground group-hover:text-foreground`.
  - Search bar input styled with 1px border (`border-border`) and monochrome `⌘K` badge.
- **`src/components/client/header.tsx` & `sidebar.tsx`:**
  - Header: 56px (`h-14`) sticky height, `backdrop-blur-md`, subtle border-b matching website `.site-header`.
  - Sidebar: Slate background, monochrome icons (`text-slate-600 dark:text-slate-400`), active navigation indicator with `bg-secondary text-foreground font-semibold`.
- **`src/components/admin/header.tsx` & `sidebar.tsx`:**
  - Synchronize admin navigation with identical monochrome slate tokens.

### 4.2 Zone 2: Authentication Flow (2 Files)
- **`src/app/login/page.tsx`:**
  - Left Feature Showcase: 4 cards (`Air-Gap Privacy`, `64k-Node Graph`, `Garuda Agents`, `Community`) styled with `rounded-xl`, `border-border`, monospace tags `01`, `02`, `03`, `04` in `font-mono text-xs font-bold text-muted-foreground`, and Slate-900 titles.
  - Right Tabs: `[Sign In]` & `[Register License]` minimal tab switcher; slate input borders; primary submit button rendered as solid high-contrast black/white (`Button variant="default"`).
- **`src/app/register/page.tsx`:**
  - Ensure redirect/tab switching to `/login?tab=register` renders seamlessly.

### 4.3 Zone 3: Client Dashboard Pages & Modals (15 Files)
- **`src/app/dashboard/page.tsx` (Chamber Overview / Workstations):**
  - Purge hardcoded `border-amber-500/30`, `bg-amber-500/15 text-amber-500`, and `bg-amber-500` buttons.
  - Sovereign Agent Packages (`.haya`): Clean typographic cards with `font-mono` version tags, solid black/white download CTA.
  - Hardware Device Seats: Clean dot indicators (`ACTIVE` = emerald dot, `IDLE` = slate dot) inside `rounded-xl` cards.
  - Reference Catalogs: 3-column minimal grid matching website pillar cards.
- **`src/app/dashboard/workspace/page.tsx` & `licenses/page.tsx`:**
  - Monospace license keys, clean copy buttons, slate hardware cards.
- **`src/app/dashboard/community/` (`CommunityBoard.tsx`, `ThreadCard.tsx`, `ThreadDrawer.tsx`, `AiReplyCard.tsx`, `TiptapEditor.tsx`):**
  - Category filter pills: Minimal outline pills (`border-border text-muted-foreground`, active: `bg-foreground text-background font-semibold`).
  - Thread cards: Clean typography, hover lift, no amber borders. AI answer indicator becomes a refined monochrome or slate badge.
  - AI Reply Card: Crisp slate legal card with statutory citations in `font-mono` tags.
  - Tiptap editor: Minimal slate borders, monochrome formatting buttons.
- **Client Modals (`create-ticket-modal`, `generate-key-modal`, `deactivate-modal`, `transfer-seat-modal`):**
  - All dialog containers, borders, inputs, and actions unified to slate tokens.

### 4.4 Zone 4: Garuda Hub Marketplace & Agent Studio (8 Files)
- **`src/app/hub/page.tsx`, `ItemCard.tsx`, `CategoryTabs.tsx`, `TaxonomySidebar.tsx`:**
  - Rebuild Garuda agent cards into 3-column minimal typographic grid matching website pillar cards.
  - Purge amber fills, tags, and buttons in favor of monochrome category tags and solid primary buttons.
- **Hub Modals (`ItemDetailModal`, `PublishModal`, `FleetSyncModal`, `ManifestCodeViewer`):**
  - Clean monochrome code viewers, slate borders, and high-contrast buttons.
- **`src/components/agents/` (`ArchetypeCard.tsx`, `BuilderAccordion.tsx`, `SandboxCanvas.tsx`):**
  - Transform Agent Studio archetype cards from colorful gradient boxes to executive typographic cards.

### 4.5 Zone 5: Super Admin Control Center (10 Files)
- **`src/app/admin/dashboard/page.tsx` & `metrics-card.tsx`:**
  - Standardize KPI cards with bold typographic numerals (`text-2xl font-bold tracking-tight text-foreground`) and slate borders.
- **`users-table.tsx`, `user-view-drawer.tsx`, `user-edit-form.tsx`, `revenue-chart.tsx`, `activity-stream.tsx`:**
  - Refined data tables with subtle 1px slate gridlines, monochrome actions, and clean pagination.
- **Admin Modals (`ticket-resolution-modal`, `soft-delete-modal`):**
  - Clean monochrome dialogs.

---

## 5. Verification & Testing Guardrails

### 5.1 Automated Test Suites
Run all existing unit and integration tests:
```bash
npm test
```
- `src/tests/community_schema.test.ts`
- `src/tests/lightrag_service.test.ts`
- `src/tests/community_api.test.ts`
- `src/tests/community_e2e.test.ts`
All 5 test suites must continue passing with zero regressions.

### 5.2 TypeScript & Build Verification
```bash
npm run build
```
Verify zero build errors, zero CSS syntax errors, and zero unresolved imports.

### 5.3 Visual Verification Matrix (Browser Subagent)
Capture side-by-side screenshots in both **Light** and **Dark** modes across:
1. `http://localhost:5050` (Website Landing & Pillar Pages)
2. `http://localhost:3300/login` (Split-Screen Auth)
3. `http://localhost:3300/dashboard` (Chamber Overview)
4. `http://localhost:3300/dashboard/community` (Discussions & AI Drawer)
5. `http://localhost:3300/hub` (Garuda Catalog)
6. `http://localhost:3300/admin/dashboard` (Super Admin)

Confirm that typography, card radiuses, border contrasts, and button weights provide complete aesthetic continuity.
