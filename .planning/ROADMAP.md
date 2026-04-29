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
- [x] All 9 empty catch blocks log errors via `console.error`
- [x] Where appropriate, errors propagate to UI toast
- [x] TypeScript compilation passes
- [x] No runtime behavior changes except better error visibility

### Phase 2: Fix Type Safety Erosion
**Goal:** Replace all 8 `any` type usages with proper TypeScript types.
**Files:** `app/(tabs)/add.tsx`, `app/(tabs)/transactions.tsx`, `components/spending-trend-chart.tsx`, `components/category-distribution-chart.tsx`, `app/(tabs)/settings.tsx`
**Success Criteria:**
- [x] All `any` usages replaced with library-specific or domain types
- [x] TypeScript strict mode still passes
- [x] No new `any` types introduced

### Phase 3: Fix API Client Bypass for Image Uploads
**Goal:** Route all image uploads through the centralized `api` service instead of raw `fetch`.
**Files:** `services/api.ts`, `app/(tabs)/add.tsx`
**Success Criteria:**
- [x] `api.postMultipart()` method added to `services/api.ts`
- [x] `add.tsx` uses `api.postMultipart()` instead of raw `fetch`
- [x] Auth headers are injected automatically
- [x] Unified error handling applies to uploads

### Phase 4: Fix Hardcoded Colors Outside Theme System
**Goal:** Replace 50+ raw hex color values with Tamagui theme tokens.
**Files:** `components/category-distribution-chart.tsx`, `components/month-picker.tsx`, `components/filter-chips.tsx`, `app/(tabs)/dashboard.tsx`, `app/(tabs)/settings.tsx`, and others
**Success Criteria:**
- [x] Chart colors mapped to theme tokens in `tamagui.config.ts`
- [x] All raw hex values in components replaced with `$token` references
- [x] Dark mode compatibility verified
- [x] No visual regressions

### Phase 5: Add Error Boundaries
**Goal:** Add React error boundaries to prevent full app unmount on crashes.
**Files:** `app/_layout.tsx`, new `components/error-boundary.tsx`
**Success Criteria:**
- [x] Error boundary component wraps the app navigation stack
- [x] Graceful fallback UI shown on error
- [x] Error details logged for debugging
- [x] AuthGuard and main screens are protected

### Phase 6: Add Rate Limiting / Debouncing
**Goal:** Prevent accidental duplicate submissions and excessive API calls.
**Files:** `app/(tabs)/transactions.tsx` (search), `app/(tabs)/add.tsx` (save), `components/transaction-form.tsx`
**Success Criteria:**
- [x] Search input debounced in transactions screen
- [x] Save/submit buttons prevent rapid re-submission
- [x] No user-visible latency added

### Phase 7: Fix Security Issues
**Goal:** Address unencrypted user profile storage and insecure API fallback URL.
**Files:** `stores/auth.ts`, `lib/config.ts`
**Success Criteria:**
- [x] User profile moved to SecureStore or encrypted before AsyncStorage
- [x] Production build throws if `EXPO_PUBLIC_API_URL` is missing
- [x] `http://localhost:3000` fallback removed from production

### Phase 8: Add Basic Test Infrastructure
**Goal:** Set up Jest + React Native Testing Library and add first tests.
**Files:** `package.json`, new test files for `lib/image-utils.ts`, `hooks/use-transaction-filters.ts`, `services/api.ts`
**Success Criteria:**
- [x] Jest + `@testing-library/react-native` configured
- [x] At least 3 test files with passing tests
- [x] `npm test` script works
- [x] Tests run in CI-friendly mode

---

## Progress

| Phase | Name | Status |
|-------|------|--------|
| 1 | Fix Silent Error Swallowing | ✅ Complete |
| 2 | Fix Type Safety Erosion | ✅ Complete |
| 3 | Fix API Client Bypass for Image Uploads | ✅ Complete |
| 4 | Fix Hardcoded Colors Outside Theme System | ✅ Complete |
| 5 | Add Error Boundaries | ✅ Complete |
| 6 | Add Rate Limiting / Debouncing | ✅ Complete |
| 7 | Fix Security Issues | ✅ Complete |
| 8 | Add Basic Test Infrastructure | ✅ Complete |
| 9 | Copy & Color Overhaul | ✅ Complete |
| 10 | Dashboard Spacing & Layout | ✅ Complete |
| 11 | Login & Empty States | ✅ Complete |
| 12 | Micro-interactions & Animations | ✅ Complete |
| 13 | Gestures & Interaction Polish | ✅ Complete |

---

## Milestone: UI Enhancement & Aesthetic Polish

**Version:** v2.0
**Goal:** Elevate the app from generic React Native to a distinctive, editorial, human-feeling UI per the UI audit review.
**Start Date:** 2025-04-29
**Target Completion:** 2025-04-29

---

### Phase 9: Copy & Color Overhaul
**Goal:** Rewrite copy with personality and replace generic Tailwind colors with a distinctive palette.
**Files:** `app/(tabs)/add.tsx`, `app/login.tsx`, `components/spending-trend-chart.tsx`, `components/analytics-card.tsx`, `app/(tabs)/categories.tsx`, `themes/colors.ts`, `tamagui.config.ts`
**Success Criteria:**
- [x] Add screen buttons and headers feel human, not robotic
- [x] Empty states have warmth and personality
- [x] Primary color changed from generic `#2563EB`
- [x] Chart colors curated to 4-5 muted harmonious tones
- [x] TypeScript compilation passes

### Phase 10: Dashboard Spacing & Layout
**Goal:** Break up the card wall on Dashboard with section spacing and smarter card grouping.
**Files:** `app/(tabs)/dashboard.tsx`, `app/(tabs)/_layout.tsx`, `components/card.tsx`
**Success Criteria:**
- [x] Section spacing (32-48px) between logical groups
- [x] Total Spending + Transactions combined into summary row
- [x] Tab bar height increased to 64px
- [x] No visual regressions

### Phase 11: Login & Empty States
**Goal:** Style the login screen with visual warmth and add empty-state icons/illustrations.
**Files:** `app/login.tsx`, `components/image-picker-button.tsx`, `components/skeleton.tsx`, `app/(tabs)/categories.tsx`
**Success Criteria:**
- [x] Login screen has background gradient/texture and larger hero typography
- [x] Image picker button redesigned with dashed border and friendly prompt
- [x] Empty states include icon or simple illustration
- [x] TypeScript compilation passes

### Phase 12: Micro-interactions & Animations
**Goal:** Add living motion: chart entrance animations, animated numbers, and parsing progress personality.
**Files:** `components/spending-trend-chart.tsx`, `components/category-distribution-chart.tsx`, `app/(tabs)/dashboard.tsx`, `app/(tabs)/add.tsx`
**Success Criteria:**
- [x] Spending trend chart animates on load (line draws, area fades in)
- [x] Category distribution segments fan in on load
- [x] Total spending card uses animated number counting
- [x] Parsing state shows personality copy ("Reading your receipt...")
- [x] No performance regressions

### Phase 13: Gestures & Interaction Polish
**Goal:** Add swipe-to-delete, modal dismiss gestures, and tap-backdrop-to-dismiss.
**Files:** `app/(tabs)/transactions.tsx`, `components/filter-sheet.tsx`, `app/(tabs)/categories.tsx`, `app/(tabs)/add.tsx`
**Success Criteria:**
- [x] Long-press delete on transaction items
- [x] Tap backdrop to dismiss modals/sheets
- [x] TypeScript compilation passes
