# Codebase Concerns

**Analysis Date:** 2026-04-29

## Tech Debt

**Zero Test Coverage:**
- Issue: No unit tests, integration tests, or E2E tests exist in the project.
- Files: Entire codebase
- Impact: Regressions go undetected. Refactoring is high-risk. New features cannot be validated automatically.
- Fix approach: Add Jest with `@testing-library/react-native`. Start with `lib/image-utils.ts`, `hooks/use-transaction-filters.ts`, and `services/api.ts`.

**Monolithic Screen Components:**
- Issue: Screen files exceed 400 lines with mixed concerns (data fetching, mutations, local state, modal rendering, form handling).
- Files: `app/(tabs)/settings.tsx` (462 lines), `app/(tabs)/transactions.tsx` (427 lines), `app/(tabs)/add.tsx` (322 lines)
- Impact: Hard to test, hard to review, high cognitive load. Changes to one feature touch unrelated code.
- Fix approach: Extract modal contents into dedicated components. Extract form logic into hooks. Move inline modals to sub-routes where possible.

**Hardcoded Colors Outside Theme System:**
- Issue: Over 50 raw hex color values are scattered across components and screens instead of using Tamagui theme tokens.
- Files: `components/category-distribution-chart.tsx`, `components/month-picker.tsx`, `components/filter-chips.tsx`, `app/(tabs)/dashboard.tsx`, `app/(tabs)/settings.tsx`, and others
- Impact: Inconsistent theming, dark mode breakage, maintenance burden when rebranding.
- Fix approach: Map all chart colors and UI accents to `tamagui.config.ts` theme keys. Replace raw hex with `$token` references.

**API Client Bypass for Image Uploads:**
- Issue: `app/(tabs)/add.tsx` uses raw `fetch` for multipart image uploads instead of the centralized `api` service.
- Files: `app/(tabs)/add.tsx:76`
- Impact: Duplicates base URL resolution, skips Bearer token auth, bypasses unified error handling and 401 logic.
- Fix approach: Add a `postMultipart` method to `services/api.ts` that accepts `FormData`, injects the auth token, and normalizes errors.

**Silent Error Swallowing:**
- Issue: 9 empty `catch {}` blocks discard errors without logging or user feedback.
- Files: `services/auth.ts:53`, `services/auth.ts:74`, `lib/widget-bridge.ts:59`, `lib/widget-bridge.ts:81`, `lib/widget-bridge.ts:104`, `lib/auth-client.ts:18`, `hooks/use-image-picker.ts:53`, `app/(tabs)/settings.tsx:112`, `app/(tabs)/settings.tsx:140`
- Impact: Failures become invisible. Debugging production issues is nearly impossible.
- Fix approach: At minimum, log errors with `console.error`. Preferably, propagate to UI toast or error boundary.

**Production Console Logging:**
- Issue: 12 `console.log/warn/error` statements remain in production source code.
- Files: `lib/widget-bridge.ts`, `hooks/use-widget-updater.ts`
- Impact: Clutters Metro logs in development and may leak information in production builds.
- Fix approach: Replace with a wrapper that silences logs in production, or use a structured logger like `expo-logger`.

**Type Safety Erosion:**
- Issue: 8 usages of `any` type bypass TypeScript strictness.
- Files: `app/(tabs)/add.tsx:52`, `app/(tabs)/transactions.tsx:115`, `components/spending-trend-chart.tsx:75`, `components/category-distribution-chart.tsx:74`, `app/(tabs)/settings.tsx:85`
- Impact: Loses compile-time guarantees. Refactoring becomes dangerous.
- Fix approach: Replace chart callback `any` types with library-specific types. Replace mutation `data: any` with proper interfaces.

## Security Considerations

**Unencrypted User Profile Storage:**
- Risk: `user-profile` is stored in AsyncStorage (unencrypted) while auth tokens are in SecureStore.
- Files: `stores/auth.ts:46`
- Current mitigation: Auth token is encrypted; user profile is not sensitive PII by design.
- Recommendations: Store user profile in SecureStore or encrypt it before AsyncStorage persistence.

**Missing Auth on Image Upload:**
- Risk: The raw `fetch` call in `add.tsx` does not include the `Authorization` header.
- Files: `app/(tabs)/add.tsx:76`
- Current mitigation: Backend may accept anonymous uploads or rely on session cookies from Better Auth.
- Recommendations: Route all uploads through `services/api.ts` to guarantee auth headers.

**Insecure Fallback API URL:**
- Risk: Production builds can fall back to `http://localhost:3000` if `EXPO_PUBLIC_API_URL` is missing.
- Files: `lib/config.ts:5`
- Current mitigation: `.env.production` and `.env.staging` are present and committed.
- Recommendations: Throw a build-time error if `EXPO_PUBLIC_API_URL` is undefined in release builds. Remove `http://localhost:3000` fallback from production bundles.

**Missing Certificate Pinning:**
- Risk: No SSL pinning configured. Vulnerable to MITM on compromised networks.
- Files: N/A
- Current mitigation: HTTPS used for production API.
- Recommendations: Consider `react-native-ssl-pinning` if the threat model requires it.

**No Input Validation Library:**
- Risk: Manual validation is ad-hoc and inconsistent. No schema validation on form inputs or API responses.
- Files: `app/(tabs)/add.tsx`, `components/transaction-form.tsx`
- Current mitigation: Backend presumably validates.
- Recommendations: Add Zod (already in node_modules as transitive dep) for client-side and API response validation.

## Performance Bottlenecks

**Client-Side Filtering on Paginated Data:**
- Problem: `useTransactionFilters` filters only the current page of 20 transactions.
- Files: `hooks/use-transaction-filters.ts`, `app/(tabs)/transactions.tsx`
- Cause: Filters applied in-memory after API fetch.
- Improvement path: Move filter params to the API query string so filtering happens server-side across the full dataset.

**Synchronous Image Processing:**
- Problem: `expo-image-manipulator` runs on the main thread during image selection.
- Files: `lib/image-utils.ts:31`
- Cause: `manipulateAsync` is called directly without background task offloading.
- Improvement path: For large images, consider running manipulation in a background task or showing a progress indicator.

**Multiple Parallel API Calls on Dashboard:**
- Problem: Dashboard screen triggers `useQuery` for dashboard data, plus `useAnalytics` which makes 2 additional parallel requests.
- Files: `app/(tabs)/dashboard.tsx:35`, `hooks/use-analytics.ts:21`
- Cause: 3 separate network round-trips for a single screen.
- Improvement path: Add a consolidated `/dashboard` backend endpoint that returns summary, trends, and distribution in one request.

**Large Re-Renders in Settings:**
- Problem: `settings.tsx` holds 6+ local `useState` values and re-renders on every toggle/change.
- Files: `app/(tabs)/settings.tsx`
- Cause: No memoization on expensive derived values or child renders.
- Improvement path: Extract settings sections into sub-components and memoize callbacks with `useCallback`.

## Fragile Areas

**Native Widget Bridge:**
- Files: `lib/widget-bridge.ts`, `ios/ChiExpenseWidget/ChiExpenseWidgetModule.swift`, `android/.../ChiExpenseWidgetModule.kt`
- Why fragile: Depends on `ChiExpenseWidgetModule` native module existing. In Expo Go or development builds without prebuild, the module is absent and falls back to warning logs.
- Safe modification: Always maintain the fallback paths. Test widget integration on physical devices after any native module change.
- Test coverage: None.

**AuthGuard Effect Dependencies:**
- Files: `app/_layout.tsx:43`
- Why fragile: `useEffect` in `AuthGuard` depends on `isAuthenticated` and `segments`, which can change frequently and cause re-runs.
- Safe modification: Stabilize the initialization logic with a `useRef` flag to prevent double session refresh.
- Test coverage: None.

**Biometric Prompt Race Condition:**
- Files: `app/_layout.tsx:56`, `hooks/use-biometric.ts`
- Why fragile: Biometric prompt visibility is set in an effect that runs after auth state changes. Rapid auth state toggles could leave the prompt in an inconsistent state.
- Safe modification: Use a state machine instead of boolean flags for biometric flow.

## Scaling Limits

**AsyncStorage Persistence:**
- Current capacity: AsyncStorage is used for all Zustand-persisted stores (theme, security, auth profile).
- Limit: ~6MB on Android; performance degrades with large JSON strings.
- Scaling path: Migrate large or frequently-written data to SQLite (e.g., `@op-engineering/op-sqlite`) or keep in memory.

**Transaction Pagination:**
- Current capacity: 20 items per page, filtered client-side.
- Limit: Users with hundreds of transactions will see incomplete filter results.
- Scaling path: Server-side filtering and pagination. Add search index on backend.


## Dependencies at Risk

**Better Auth (v1.x):**
- Risk: Relatively new framework (v1.6.2). The Expo plugin API may change in minor versions.
- Impact: Auth flow breakage, deep-link handling changes.
- Migration plan: Pin to exact version and subscribe to release notes. Abstract auth client behind `lib/auth-client.ts` to localize migration surface.

**react-native-gifted-charts:**
- Risk: Callback props use `any` types. Library may not keep pace with React Native New Architecture (already enabled).
- Impact: TypeScript breakage, runtime crashes with Fabric renderer.
- Migration plan: Evaluate `victory-native` or Skia-based alternatives if issues arise.

**Expo SDK Patch Dependencies:**
- Risk: Many Expo packages are pinned to patch versions (`~0.29.14`, `~14.0.0`). Expo SDK 52 upgrades may require coordinated bumps.
- Impact: Version mismatch conflicts during `expo install` or EAS builds.
- Migration plan: Use `expo doctor` before every SDK update. Let Expo CLI manage compatible versions.

## Missing Critical Features

**Error Boundaries:**
- Problem: No React error boundaries are configured. A crash in any screen or component will unmount the entire app.
- Blocks: Production stability, graceful degradation.

**Offline Mutation Queue:**
- Problem: TanStack Query is used for data fetching but there is no offline mutation queue. If the user adds an expense while offline, the mutation fails immediately.
- Blocks: Reliable offline experience.

**Rate Limiting / Debouncing:**
- Problem: Search input in transactions screen and save buttons do not debounce or prevent rapid re-submission.
- Blocks: Prevents accidental duplicate transactions and excessive API calls.

**Deep Link Validation:**
- Problem: Deep link handler in `_layout.tsx` only checks `parsed.path === 'dashboard'`. No validation of path structure or query params.
- Blocks: Secure handling of OAuth callbacks or marketing campaign links.

## Test Coverage Gaps

**Entire Application:**
- What's not tested: Every screen, component, hook, service, and utility.
- Files: All `.ts` and `.tsx` files outside `node_modules/`
- Risk: Any change can break authentication, data fetching, native bridges, or UI rendering without detection.
- Priority: High

**Specific High-Risk Untested Areas:**
- `services/api.ts` — Token injection, 401 handling, error serialization
- `services/auth.ts` — OAuth callback success/failure paths, session refresh
- `lib/biometric-auth.ts` — Hardware availability edge cases, fallback to PIN
- `lib/widget-bridge.ts` — Native module absence, platform branching
- `hooks/use-transaction-filters.ts` — Filter combination logic, empty state handling

---

*Concerns audit: 2026-04-29*
