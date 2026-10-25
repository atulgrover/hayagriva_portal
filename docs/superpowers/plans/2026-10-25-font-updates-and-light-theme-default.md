# Font Updates (Noto Serif Devanagari + Tracking) & Light-Theme Default Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply `Noto Serif Devanagari` font integration, typography tracking refinements, and `light` default theme configuration across `src/app/layout.tsx` and `src/components/navigation/UnifiedNavbar.tsx` so the portal seamlessly matches the website aesthetics.

**Architecture:** Load `Noto_Serif_Devanagari` via `next/font/google` in Next.js Root Layout, exposing `--font-serif` alongside existing `--font-sans` (Inter) and `--font-mono` (JetBrains Mono). Wire `--font-serif` to `design-tokens.css` and `tailwind.config.ts`. Switch the Next.js `ThemeProvider` default to `"light"`. Update `UnifiedNavbar.tsx` to utilize `font-serif` for cultural/sovereign glyphs (such as ॐ), align the header height to 58px matching the website, and enforce high-contrast slate typographic tracking (`tracking-tight` on titles and `tracking-wider` on monospace badges).

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, `next-themes`, Google Fonts (`next/font/google`).

**Spec:** [docs/superpowers/specs/2026-10-22-shared-design-tokens-and-portal-harmonization-design.md](file:///Users/atulgrover/Desktop/HAYAGRIVA%20PORTAL/docs/superpowers/specs/2026-10-22-shared-design-tokens-and-portal-harmonization-design.md)

---

## Global Constraints

- **Zero Breaking Business Logic:** No database schemas, auth cookie names (`hayagriva_user`, `hayagriva_admin_token`), API handlers, or route guards may be modified.
- **Font Stack:**
  - `font-sans`: `Inter` (weights 300 to 800) for all primary UI, headings, inputs, and links.
  - `font-mono`: `JetBrains Mono` (weights 400 to 600) for telemetry, numbers, badges, tags, and license keys.
  - `font-serif`: `Noto Serif Devanagari` (weights 400 to 700) for Sanskrit cultural/sovereign emblems and legal maxims.
- **Default Theme:** Strictly `"light"` with `enableSystem={true}`, while preserving dark-mode theme switching capability via `next-themes`.
- **Header Dimensions:** Standardized to `58px` (`h-[58px]`) with `border-b border-border` and `backdrop-blur-md` matching the website's `--header-height: 58px`.
- **Typographic Tracking:**
  - Headings / titles: `tracking-tight` (`-0.02em`).
  - Small caps / category badges: `uppercase tracking-wider font-mono` (`0.05em` to `0.08em`).

---

## Review Focus

1. **Devanagari Glyph Rendering:** The ॐ symbol in `UnifiedNavbar` and `login/page.tsx` renders using `Noto Serif Devanagari` without layout shifting or fallback font artifacts.
2. **Default Light Mode State:** Visiting `http://localhost:3300/login` in an incognito/clean session renders directly in crisp corporate light mode (`#f8fafc` background, `#ffffff` card surface, `#0f172a` foreground) without flashing dark.
3. **Theme Switcher Integrity:** Clicking the Sun/Moon toggle in `UnifiedNavbar` smoothly toggles between light and dark modes without broken styles or text contrast loss.
4. **Header Height Consistency:** The top navbar height is exactly 58px (`h-[58px]`), maintaining visual symmetry with `HAYAGRIVA WEBSITE/header.html`.
5. **Zero TypeScript & Build Regressions:** `npx tsc --noEmit` and dev server runs cleanly with 0 errors.

---

## File Structure & Responsibilities

| File Path | Action | Role / Responsibility |
|---|---|---|
| `src/app/design-tokens.css` | Modify | Declare `--font-serif` CSS custom property in `:root`. |
| `tailwind.config.ts` | Modify | Expose `serif: ['var(--font-serif)', ...]` in Tailwind `fontFamily`. |
| `src/app/layout.tsx` | Modify | Load `Noto_Serif_Devanagari` font, inject into `<html>`, switch `ThemeProvider` to `defaultTheme="light"`, update page metadata. |
| `src/components/navigation/UnifiedNavbar.tsx` | Modify | Apply `font-serif` to ॐ emblem, set height to `h-[58px]`, apply typography tracking to links, title, and badges. |

---

## Tasks

### Task 1: Expose `--font-serif` in Design Tokens & Tailwind Configuration

**Files:**
- Modify: `src/app/design-tokens.css:7-11`
- Modify: `tailwind.config.ts:57-61`

- [x] **Step 1: Update `src/app/design-tokens.css`**
  Add `--font-serif` to `:root`:
  ```css
  --font-serif: 'Noto Serif Devanagari', -apple-system, Georgia, serif;
  ```
- [x] **Step 2: Update `tailwind.config.ts`**
  Add `serif` to `theme.extend.fontFamily`:
  ```ts
  fontFamily: {
    sans: ['var(--font-sans)', '-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', 'sans-serif'],
    mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
    serif: ['var(--font-serif)', '"Noto Serif Devanagari"', 'Georgia', 'serif'],
  },
  ```
- [x] **Step 3: Verify TypeScript compilation**
  Run: `npx tsc --noEmit`
  Expected: Exits with code 0.

---

### Task 2: Configure Fonts, Light Default Theme & Metadata in `src/app/layout.tsx`

**Files:**
- Modify: `src/app/layout.tsx:1-47`

- [x] **Step 1: Import and initialize `Noto_Serif_Devanagari`**
  In `src/app/layout.tsx`, import `Noto_Serif_Devanagari` from `next/font/google`:
  ```tsx
  import { Inter, JetBrains_Mono, Noto_Serif_Devanagari } from 'next/font/google';

  const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-sans',
  });

  const jetbrainsMono = JetBrains_Mono({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-mono',
  });

  const notoSerifDevanagari = Noto_Serif_Devanagari({
    subsets: ['devanagari'],
    weight: ['400', '500', '600', '700'],
    display: 'swap',
    variable: '--font-serif',
  });
  ```
- [x] **Step 2: Inject font variable into `<html>`**
  Update `RootLayout`:
  ```tsx
  <html 
    lang="en" 
    suppressHydrationWarning 
    className={`${inter.variable} ${jetbrainsMono.variable} ${notoSerifDevanagari.variable}`}
  >
  ```
- [x] **Step 3: Update `ThemeProvider` to default to `light`**
  Configure `ThemeProvider` with `defaultTheme="light"` and `enableSystem={true}`:
  ```tsx
  <ThemeProvider
    attribute="class"
    defaultTheme="light"
    enableSystem={true}
    disableTransitionOnChange
  >
    {children}
  </ThemeProvider>
  ```
- [x] **Step 4: Update document metadata**
  Align page title and description with the sovereign platform:
  ```tsx
  export const metadata: Metadata = {
    title: 'Hayagriva Portal | Sovereign Legal AI Chamber & Control Plane',
    description: 'Sovereign AI Suite, Decentralized Legal Chamber & Licensing Control Plane for Advocates and Insolvency Professionals',
    icons: {
      icon: '/favicon.ico',
    },
  };
  ```
- [x] **Step 5: Verify TypeScript compilation**
  Run: `npx tsc --noEmit`
  Expected: Exits with code 0.

---

### Task 3: Harmonize `UnifiedNavbar.tsx` (Devanagari Serif, 58px Height & Tracking)

**Files:**
- Modify: `src/components/navigation/UnifiedNavbar.tsx:55-150`

- [x] **Step 1: Standardize header container height and glassmorphism**
  Update `<header>` container class:
  ```tsx
  <header className="h-[58px] border-b border-border bg-card/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 transition-colors">
  ```
- [x] **Step 2: Apply `font-serif` to the ॐ emblem block**
  Update the brand logo box:
  ```tsx
  <div className="w-7 h-7 rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-950 flex items-center justify-center font-bold text-sm shadow-xs group-hover:scale-105 transition-transform font-serif select-none">
    ॐ
  </div>
  ```
- [x] **Step 3: Refine typographic hierarchy & tracking on navigation tabs and badges**
  - Brand Title: `text-xs font-bold tracking-tight text-foreground`
  - Sovereign Badge: `text-[9px] font-mono px-1.5 py-0.5 rounded bg-secondary text-foreground font-semibold border border-border uppercase tracking-wider`
  - Subtitle: `text-[9px] text-muted-foreground tracking-tight`
  - Navigation Tabs: `px-3 py-1.5 rounded-md text-xs font-medium tracking-tight transition-all flex items-center gap-1.5`
  - Active Tab State: `bg-secondary text-foreground shadow-xs font-semibold border border-border/60`
  - Organization Badge: `font-mono text-[9px] px-1.5 py-0.5 rounded bg-secondary text-foreground font-bold border border-border uppercase tracking-wider`
- [x] **Step 4: Verify TypeScript compilation**
  Run: `npx tsc --noEmit`
  Expected: Exits with code 0.

---

### Task 4: End-to-End Verification Across Light & Dark Themes

**Files:**
- Verification only

- [x] **Step 1: Check HTTP response and HTML source on running dev server**
  Run: `curl -s http://localhost:3300/login | grep -E "font-serif|light"`
  Expected: Confirms font classes and theme variables are present in the DOM.
- [x] **Step 2: Visual Inspection in Browser Subagent**
  - Navigate to `http://localhost:3300/login` in browser.
  - Verify that the page loads in light mode by default.
  - Verify the ॐ glyph in the brand header renders with the elegant `Noto Serif Devanagari` font.
  - Navigate to `http://localhost:3300/hub` or `http://localhost:3300/dashboard`.
  - Toggle between Light and Dark modes via the theme button in `UnifiedNavbar` to verify seamless styling.
- [x] **Step 3: Run existing unit test suite**
  Run: `npm test`
  Expected: All tests pass.
