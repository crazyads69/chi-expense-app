# External Integrations

**Analysis Date:** 2026-04-29

## APIs & External Services

**Backend API:**
- Production: `https://chi-expense.vercel.app`
- Staging: `https://staging.chi-expense.vercel.app`
- Local development: `http://localhost:3000`
- Base path: `/api/v1`
- Client implementation: `services/api.ts`

**API Client Pattern:**
- Custom `fetch` wrapper in `services/api.ts`
- Bearer token authentication via `Authorization` header
- Token sourced from `expo-secure-store` via `secureStorage.getItem('auth-token')`
- Automatic 401 handling: clears token and throws `ApiError`
- Methods: `api.get`, `api.post`, `api.patch`, `api.delete`

**Backend Endpoints Consumed:**
- `GET /api/v1/insights/trends?endMonth={month}&months=6` — Spending trend data
- `GET /api/v1/insights?month={month}` — Category distribution data
- `GET /api/v1/transactions?month={month}&page={page}&limit=20` — Paginated transaction list
- `POST /api/v1/transactions` — Create new transaction
- `PATCH /api/v1/transactions/{id}` — Update transaction
- `DELETE /api/v1/transactions/{id}` — Delete transaction
- `GET /api/v1/categories` — List categories
- `POST /api/v1/categories` — Create category
- `POST /api/v1/input/text` — Parse expense from text/SMS
- `POST /api/v1/input/image` — Parse receipt from image (uses raw `fetch`, not `api` service)
- `GET /api/v1/account/export` — Export user data
- `DELETE /api/v1/account` — Delete account

## Authentication & Identity

**Auth Provider:** Better Auth (self-hosted/backend)
- Client: `lib/auth-client.ts`
- Base URL: backend API URL
- Base path: `/api/auth`
- Expo client plugin handles deep-link OAuth callbacks

**Social Login Providers:**
- **GitHub** — `authClient.signIn.social({ provider: 'github', callbackURL: 'chi-expense://' })`
- **Apple** — `authClient.signIn.social({ provider: 'apple', callbackURL: 'chi-expense://' })`

**Session Storage:**
- In-memory cache + `expo-secure-store` persistence
- Keys: `chi-expense_cookie`, `chi-expense_session_data`
- Custom storage adapter bridges sync Zustand needs with async SecureStore

**Token Management:**
- Separate Bearer token stored in `expo-secure-store` under `auth-token`
- Used by `services/api.ts` for API requests
- Cleared on 401 response or logout

**Biometric Authentication:**
- `expo-local-authentication` ~15.0.2
- Supports Face ID (iOS) and fingerprint (Android)
- Configurable lock timeout (default 5 minutes)
- Falls back to device PIN if biometric fails
- Implementation: `lib/biometric-auth.ts`, hook: `hooks/use-biometric.ts`

## Data Storage

**Databases:**
- None local. All data stored server-side via REST API.

**Local Storage:**
- `expo-secure-store` — Encrypted storage for auth tokens and session data
- `@react-native-async-storage/async-storage` — Unencrypted storage for app preferences and cached widget data

**File Storage:**
- `expo-image-picker` — Access to device camera and photo library
- `expo-image-manipulator` — Client-side image resize/compress before upload
- `expo-media-library` — Save receipt photos to device library

**Caching:**
- TanStack Query in-memory cache (5-minute stale time default)
- AsyncStorage for Zustand-persisted stores (theme, security)

## Deep Linking & URL Schemes

**App Scheme:** `chi-expense://`

**Deep Link Handling:**
- OAuth callback URL for social login: `chi-expense://`
- Internal navigation: parsed in `app/_layout.tsx` via `expo-linking`
- Routes handled: `/dashboard` redirects to `/(tabs)/dashboard`
- Initial URL checked on app launch
- Android widget PendingIntent opens `chi-expense://dashboard`

**Web Browser:**
- `expo-web-browser` ~14.0.2 used for OAuth sign-in flows (GitHub/Apple)

## Environment Configuration

**Production:**
- File: `.env.production`
- `EXPO_PUBLIC_API_URL=https://chi-expense.vercel.app`

**Staging:**
- File: `.env.staging`
- `EXPO_PUBLIC_API_URL=https://staging.chi-expense.vercel.app`

**Runtime Config:**
- `expo-constants` reads from `expoConfig.extra.apiUrl` for EAS builds
- Fallback chain: `Constants.expoConfig.extra.apiUrl` → `process.env.EXPO_PUBLIC_API_URL` → `http://localhost:3000`

## CI/CD & Deployment

**Hosting:**
- Backend hosted on Vercel (production + staging)
- Mobile app built via Expo Application Services (EAS) — inferred from `eas.projectId` references

**CI Pipeline:**
- Not detected in repository

## Monitoring & Observability

**Error Tracking:**
- Not detected (no Sentry, Bugsnag, or Crashlytics imports found)

**Logging:**
- Console-based logging only (`console.log`, `console.error`, `console.warn`)
- No structured logging framework detected

## Webhooks & Callbacks

**Incoming:**
- None detected

**Outgoing:**
- None detected (app acts purely as API consumer)

## Third-Party Services Summary

| Service | Purpose | Integration File |
|---------|---------|-----------------|
| Vercel (Backend) | REST API hosting | `lib/config.ts` |
| Better Auth | Authentication framework | `lib/auth-client.ts`, `services/auth.ts` |
| GitHub OAuth | Social login | `services/auth.ts` |
| Apple Sign In | Social login | `services/auth.ts` |

## Security Considerations

**Data in Transit:**
- Production API uses HTTPS
- Local development falls back to HTTP (`localhost:3000`)

**Sensitive Data Storage:**
- Auth tokens in `expo-secure-store` (encrypted, OS-level keychain/keystore)
- Session cookies in `expo-secure-store`
- User profile cached in AsyncStorage (unencrypted)

**OAuth Flow:**
- Uses `expo-web-browser` for external OAuth (safer than WebView)
- Deep link callback returns to app via `chi-expense://` scheme

**Image Upload:**
- Raw `fetch` call in `app/(tabs)/add.tsx` for multipart upload
- Does NOT include `Authorization` header (bypasses centralized `api` service)

---

*Integration audit: 2026-04-29*
