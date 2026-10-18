# Project Memory Index

Last Updated: 2026-10-19 01:05 IST

## Overview
**Hayagriva Portal** is the centralized licensing, sovereign AI distribution, and device management control plane for the Hayagriva Sovereign AI Suite.

## Ecosystem Architecture
- **Hayagriva Portal** (`/Users/atulgrover/Desktop/HAYAGRIVA PORTAL`): Next.js 15, React 19, Drizzle ORM, Neon Serverless PostgreSQL, Cloudflare R2 object storage. Repository: `https://github.com/atulgrover/hayagriva_portal.git` (branch `main`).
- **Hayagriva Harness** (`/Users/atulgrover/Desktop/HAYAGRIVA HARNESS`): Desktop harness (AnythingLLM runtime) with local LLM models and collector.
- **Hayagriva Website** (`/Users/atulgrover/Desktop/HAYAGRIVA WEBSITE`): Distribution and public portal interface.

## High-Signal Memory Topics
- [System Architecture](.omg/memory/system-architecture.md): Database schemas, R2 storage bindings, authentication & crypto licensing protocol.
- [Session Status & Progress](.omg/memory/session-status.md): Recent commits, bug fixes, deployment state, and verified builds.
- [Resumption Checkpoint](.omg/state/checkpoint.md): Detailed state, safe shutdown record, and action items for tomorrow's session.

## Core Rules & Conventions
1. **Zero Data Leaks**: Sovereign airgap constraints apply to all license packs and hardware-bound tokens.
2. **Database Integrity**: Schema updates managed via Drizzle (`drizzle.config.ts`, `src/db/schema.ts`).
3. **Storage Access**: Binary installer delivery uses Cloudflare R2 public fallback + presigned S3 URLs (`src/lib/storage/s3.ts`).
4. **Git Hygiene**: Always run `npx tsc --noEmit` before staging, commit cleanly, and sync with `origin/main`.
