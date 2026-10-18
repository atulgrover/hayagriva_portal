# Production Auth, Streamlined Login & Real License Registration Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the portal authentication into a simple, production-ready email/password system with `atulgroverr@gmail.com` / `@Guruji46` as the sole Super Admin, eliminate all demo chamber placeholders/pills, and enable new users to register and automatically receive 1 real workstation license.

**Architecture:** Replace the dual-tab demo login UI with a minimalist email/password form calling `/api/auth/login`. Clean out hardcoded demo chambers and old mock accounts from seed and API stores, establishing `atulgroverr@gmail.com` as the Super Admin. Ensure the `/api/auth/register` flow issues real cryptographic license keys (1 license/user, 1 device slot limit) and auto-authenticates the new user directly into their workspace.

**Tech Stack:** Next.js 15 (App Router, Server Routes, React 19 Client Components), TypeScript, Tailwind CSS, Web Cryptography (Node `crypto`), Drizzle ORM / InMemory AdminStore.

**Spec:** User instruction — "keep the login supre simple.... email/password only... delete the demo chambers ... make my admin credentians only atulgroverr@gmail.com/@Guruji46 ... we are going live ... allow new users to actually register and obtain real licenses (1 license/user) ... plan first"

## Global Constraints

- Login UI must contain ONLY email and password fields, submit button, and a link to register (no tabs, no demo pills).
- Demo chambers and old demo accounts (`r.rao`, `pooja`, `superadmin@hayagriva.app`, etc.) must be removed from seed data and login UI.
- Super Admin credentials must be strictly `atulgroverr@gmail.com` and `@Guruji46`.
- New registrations must automatically receive 1 real license with `maxDevices: 1` and be immediately active.
- Full type safety: `npm run build` must succeed with zero errors.

## Review Focus

1. **Super Admin login redirection**: Logging in with `atulgroverr@gmail.com` and `@Guruji46` must redirect to `/admin/dashboard` with role `SUPER_ADMIN`.
2. **New user registration & license creation**: Registering an account must generate a unique `HAYA-` license key, store it, set session cookies, and redirect to the dashboard.
3. **Regular user login redirection**: Logging in with a registered user's email and password must redirect to `/dashboard` (or `/hub`) with role `ADVOCATE`.
4. **Invalid credentials rejection**: Entering an invalid email or password must display an error banner and not allow access.
5. **No leftover demo data on UI**: The login page must not display any demo chambers or pre-filled buttons.

---

### Task 1: Update Seed Data and Admin Credentials for Production

**Files:**
- Modify: `src/lib/db/seed.ts`
- Modify: `src/middleware.ts`
- Modify: `src/components/admin/header.tsx`
- Modify: `src/app/admin/profile/page.tsx`
- Test: `src/tests/auth_login_api.test.ts`

**Interfaces:**
- Consumes: User and License schemas from `src/lib/db/schema.ts`
- Produces: Clean `AdminStore` with `atulgroverr@gmail.com` as the sole Super Admin, 1 real admin license, and zero demo chamber accounts.

- [ ] **Step 1: Write/update test for production admin credentials in `src/tests/auth_login_api.test.ts`**
  Assert that `atulgroverr@gmail.com` with `@Guruji46` succeeds and returns `role: 'SUPER_ADMIN'`, while old demo accounts are rejected.

- [ ] **Step 2: Run test to observe current status**
  Run: `node --import tsx src/tests/auth_login_api.test.ts`
  Expected: FAIL until seed data and admin accounts are updated.

- [ ] **Step 3: Update `src/lib/db/seed.ts`**
  - Set Super Admin: `name: 'Atul Grover'`, `email: 'atulgroverr@gmail.com'`, `passwordHash: '$sha256$923dc9bb16366d37e4c644284d650d31a601c5b19ae412ae07cc2e3366f6e026'`, `role: 'SUPER_ADMIN'`, `plan: 'ENTERPRISE'`.
  - Set 1 Admin License for Atul Grover (`userId: 'usr_superadmin_01'`, `licenseKey: 'HAYA-SOV-CHAMBER-2026-LIVE'`, `maxDevices: 1`).
  - Remove all mock demo accounts (`usr_adv_01` through `usr_adv_06`) and demo chamber activations.
  - Update `src/middleware.ts`, `src/components/admin/header.tsx`, and `src/app/admin/profile/page.tsx` to reference `atulgroverr@gmail.com`.

- [ ] **Step 4: Update `src/app/api/auth/login/route.ts`**
  - Ensure password verification supports `$sha256$`, direct password check, and explicitly recognizes `atulgroverr@gmail.com` with `@Guruji46`.
  - Ensure case-insensitivity on email lookup.

- [ ] **Step 5: Run tests and verify**
  Run: `node --import tsx src/tests/auth_login_api.test.ts`
  Expected: PASS

- [ ] **Step 6: Commit**
  ```bash
  git add src/lib/db/seed.ts src/middleware.ts src/components/admin/header.tsx src/app/admin/profile/page.tsx src/app/api/auth/login/route.ts src/tests/auth_login_api.test.ts
  git commit -m "feat(auth): configure live superadmin atulgroverr@gmail.com and clean demo accounts"
  ```

---

### Task 2: Redesign `/login` Page to Streamlined Email/Password Only

**Files:**
- Modify: `src/app/login/page.tsx`

**Interfaces:**
- Consumes: `POST /api/auth/login` endpoint
- Produces: Clean, simple login form with Email and Password inputs only; redirects to `/admin/dashboard` or `/dashboard` based on role.

- [ ] **Step 1: Replace `/login` page implementation**
  - Remove tab switcher ("Chamber License Key" / "Advocate Login").
  - Remove all demo chamber cards, pills, and buttons.
  - Remove hardcoded client-side `licenseMap` and bypasses.
  - Create streamlined form with:
    - Hayagriva logo and clean header: "Hayagriva Sovereign Portal"
    - Email input field with icon and placeholder `name@example.com`
    - Password input field with icon and placeholder `••••••••••••`
    - "Sign In" button with loading state
    - Inline error alert for invalid credentials
    - Bottom link: "New to Hayagriva? Register for a license →" linking to `/register`
  - On submit: call `fetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })`.
  - On success: read `user.role` from response and redirect:
    - `SUPER_ADMIN` or `ADMIN` -> `/admin/dashboard`
    - `ADVOCATE` -> `/dashboard`

- [ ] **Step 2: Verify `/login` compilation**
  Run: `npm run build`
  Expected: PASS

- [ ] **Step 3: Commit**
  ```bash
  git add src/app/login/page.tsx
  git commit -m "feat(login): simplify login page to email/password only and remove demo chambers"
  ```

---

### Task 3: Streamline User Registration & Real License Provisioning (1 License/User)

**Files:**
- Modify: `src/app/register/page.tsx`
- Modify: `src/lib/services/registration.ts`
- Test: `src/tests/auth_register_api.test.ts`

**Interfaces:**
- Consumes: Registration inputs (name, email, password, confirmPassword, firmName)
- Produces: New user record with hashed password and exactly 1 active cryptographic license key (`maxDevices: 1`), with automatic session cookie issuance.

- [ ] **Step 1: Write test for user registration & 1-license provisioning**
  Verify that registering a new user creates the user, generates a unique `HAYA-` license with `maxDevices: 1`, sets session tokens, and allows immediate login.

- [ ] **Step 2: Run test to observe current status**
  Run: `node --import tsx src/tests/auth_register_api.test.ts`
  Expected: Verify passes or update assertions for live requirements.

- [ ] **Step 3: Update `src/app/register/page.tsx`**
  - Clean out any demo references in placeholders.
  - Ensure clear messaging: "Register for your Sovereign License (1 Seat Included)".
  - On submit: calls `/api/auth/register` and on success redirects to `/dashboard/licenses?new_registration=true` or `/dashboard`.

- [ ] **Step 4: Verify `npm run build` and run test suite**
  Run: `npm run build`
  Expected: PASS

- [ ] **Step 5: Commit**
  ```bash
  git add src/app/register/page.tsx src/lib/services/registration.ts src/tests/auth_register_api.test.ts
  git commit -m "feat(register): streamline user registration with automatic 1-license provisioning"
  ```

---

### Task 4: End-to-End Verification & Browser Validation

**Files:**
- Test: Playwright or curl/fetch automated verification

- [ ] **Step 1: Test Super Admin Login via API**
  Verify `POST /api/auth/login` with `atulgroverr@gmail.com` and `@Guruji46` returns 200, valid session cookies, and `role: "SUPER_ADMIN"`.

- [ ] **Step 2: Test New User Registration & License Provisioning via API**
  Register a test practitioner `practitioner.test@gmail.com`, verify 1 license is created with `maxDevices: 1` and unique key.

- [ ] **Step 3: Test New User Login via API**
  Verify the new practitioner can log in with their email and password and receives their provisioned license.

- [ ] **Step 4: Verify Full Production Build**
  Run: `npm run build`
  Expected: Compiled successfully with zero errors.

- [ ] **Step 5: Push updates to repository**
  ```bash
  git push origin main
  ```
