# System Architecture & Storage Protocol

## 1. Storage & Distribution (Cloudflare R2)
- **R2 Public Bucket**: `pub-35371afc7da748a481da639a4f0d486e.r2.dev`
- **Fallback URL Logic**: `src/lib/storage/s3.ts` checks `R2_PUBLIC_URL` / `NEXT_PUBLIC_R2_PUBLIC_URL` and formats direct download links when presigned S3 client is omitted or in public distribution mode.
- **Desktop Artifact Keys** (`src/lib/catalog.ts`):
  - macOS: `builds/hayagriva-mac-x64.dmg`
  - Windows: `Hayagriva-Setup-1.17.0.exe` (mapped to `hayagriva-win-x64.exe` & `Hayagriva-Setup-1.17.0.exe`)
  - Linux: `builds/hayagriva-linux-x64.AppImage`

## 2. Authentication & Admin Security
- **Superadmin Account**: `atulgroverr@gmail.com`
- **Session Handling**: Multi-pass resilient JSON cookie parsing to prevent double-encoding edge cases (`src/lib/auth.ts`).
- **Registration**: Auto-provisions 1 sovereign license key upon email sign-up.

## 3. Sovereign Desktop Harness Integration
- Harness frontend runs on port 3000 (Vite).
- Backend and collector run concurrently (`yarn dev:server`, `yarn dev:collector`).
- Harness verifies licenses and hardware fingerprints against Portal API endpoints (`/api/v1/license/verify`).
