# ROADMAP

## Milestone: Tech Debt & Concerns Resolution

**Version:** v1.0
**Goal:** Resolve all high-priority concerns from CONCERNS.md to improve code quality, security, and maintainability.
**Start Date:** 2025-04-29
**Target Completion:** 2025-04-29

---

## Phases

### Phase 1: Fix Silent Error Swallowing
**Goal:** Eliminate all empty `catch {}` blocks that silently discard errors.
**Files:** `services/auth.ts`, `lib/widget-bridge.ts`, `lib/auth-client.ts`, `hooks/use-image-picker.ts`, `app/(tabs)/settings.tsx`
**Success Criteria:**
- [ ] All 9 empty catch blocks log errors via `console.error`
- [ ] Where appropriate, errors propagate to UI toast
- [ ] TypeScript compilation passes
- [ ] No runtime behavior changes except better error visibility

### Phase 2: Fix Type Safety Erosion
**Goal:** Replace all 8 `any` type usages with proper TypeScript types.
**Files:** `app/(tabs)/add.tsx`, `app/(tabs)/transactions.tsx`, `components/spending-trend-chart.tsx`, `components/category-distribution-chart.tsx`, `app/(tabs)/settings.tsx`
**Success Criteria:**
- [ ] All `any` usages replaced with library-specific or domain types
- [ ] TypeScript strict mode still passes
- [ ] No new `any` types introduced

### Phase 3: Fix API Client Bypass for Image Uploads
**Goal:** Route all image uploads through the centralized `api` service instead of raw `fetch`.
**Files:** `services/api.ts`, `app/(tabs)/add.tsx`
**Success Criteria:**
- [ ] `api.postMultipart()` method added to `services/api.ts`
- [ ] `add.tsx` uses `api.postMultipart()` instead of raw `fetch`
- [ ] Auth headers are injected automatically
- [ ] Unified error handling applies to uploads

### Phase 4: Fix Hardcoded Colors Outside Theme System
**Goal:** Replace 50+ raw hex color values with Tamagui theme tokens.
**Files:** `components/category-distribution-chart.tsx`, `components/month-picker.tsx`, `components/filter-chips.tsx`, `app/(tabs)/dashboard.tsx`, `app/(tabs)/settings.tsx`, and others
**Success Criteria:**
- [ ] Chart colors mapped to theme tokens in `tamagui.config.ts`
- [ ] All raw hex values in components replaced with `$token` references
- [ ] Dark mode compatibility verified
- [ ] No visual regressions

### Phase 5: Add Error Boundaries
**Goal:** Add React error boundaries to prevent full app unmount on crashes.
**Files:** `app/_layout.tsx`, new `components/error-boundary.tsx`
**Success Criteria:**
- [ ] Error boundary component wraps the app navigation stack
- [ ] Graceful fallback UI shown on error
- [ ] Error details logged for debugging
- [ ] AuthGuard and main screens are protected

### Phase 6: Add Rate Limiting / Debouncing
**Goal:** Prevent accidental duplicate submissions and excessive API calls.
**Files:** `app/(tabs)/transactions.tsx` (search), `app/(tabs)/add.tsx` (save), `components/transaction-form.tsx`
**Success Criteria:**
- [ ] Search input debounced in transactions screen
- [ ] Save/submit buttons prevent rapid re-submission
- [ ] No user-visible latency added

### Phase 7: Fix Security Issues
**Goal:** Address unencrypted user profile storage and insecure API fallback URL.
**Files:** `stores/auth.ts`, `lib/config.ts`
**Success Criteria:**
- [ ] User profile moved to SecureStore or encrypted before AsyncStorage
- [ ] Production build throws if `EXPO_PUBLIC_API_URL` is missing
- [ ] `http://localhost:3000` fallback removed from production

### Phase 8: Add Basic Test Infrastructure
**Goal:** Set up Jest + React Native Testing Library and add first tests.
**Files:** `package.json`, new test files for `lib/image-utils.ts`, `hooks/use-transaction-filters.ts`, `services/api.ts`
**Success Criteria:**
- [ ] Jest + `@testing-library/react-native` configured
- [ ] At least 3 test files with passing tests
- [ ] `npm test` script works
- [ ] Tests run in CI-friendly mode

---

## Progress

| Phase | Name | Status |
|-------|------|--------|
| 1 | Fix Silent Error Swallowing | Not Started |
| 2 | Fix Type Safety Erosion | Not Started |
| 3 | Fix API Client Bypass for Image Uploads | Not Started |
| 4 | Fix Hardcoded Colors Outside Theme System | Complete |
| 5 | Add Error Boundaries | Not Started |
| 6 | Add Rate Limiting / Debouncing | Not Started |
| 7 | Fix Security Issues | Not Started |
| 8 | Add Basic Test Infrastructure | Not Started |
