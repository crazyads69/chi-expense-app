# Testing Patterns

**Analysis Date:** 2026-04-29

## Test Framework

**Runner:** Not detected. No test runner configured in the project.

**Assertion Library:** Not detected.

**Config:** None present. No `jest.config.js`, `vitest.config.ts`, or equivalent found in the project root.

**Run Commands:**
```bash
# No test scripts defined in package.json
# Only available scripts:
npm run lint       # ESLint check
npm run lint:fix   # ESLint auto-fix
npm run typecheck  # TypeScript --noEmit
```

## Test File Organization

**Location:** Not applicable — no test files exist in the project source.

**Naming:** Not applicable.

**Structure:** Not applicable.

## Test Structure

**Suite Organization:** Not applicable.

**Patterns:** Not applicable.

## Mocking

**Framework:** Not detected.

**Patterns:** Not applicable.

**What to Mock:** Not defined.

**What NOT to Mock:** Not defined.

## Fixtures and Factories

**Test Data:** Not applicable.

**Location:** Not applicable.

## Coverage

**Requirements:** None enforced.

**View Coverage:** Not applicable.

## Test Types

**Unit Tests:**
- Not present.
- Scope: Would cover utilities (`lib/image-utils.ts`, `lib/biometric-auth.ts`), hooks (`hooks/use-transaction-filters.ts`), and service methods.

**Integration Tests:**
- Not present.
- Scope: Would cover API client behavior (`services/api.ts`), auth flows (`services/auth.ts`), and TanStack Query hooks.

**E2E Tests:**
- Not used. No Detox, Maestro, Appium, or Playwright configuration detected.

## Common Patterns

**Async Testing:** Not applicable.

**Error Testing:** Not applicable.

## Testing Debt

**Current State:** The project has zero automated tests. This is a significant quality gap.

**Files with complex logic that warrant testing:**
- `services/api.ts` — HTTP client with auth, 401 handling, error normalization
- `services/auth.ts` — Social sign-in orchestration, session refresh
- `hooks/use-transaction-filters.ts` — Filter logic with search, category, and amount range
- `hooks/use-image-picker.ts` — Image validation, resizing, and picker state
- `lib/image-utils.ts` — Image validation and resize logic
- `lib/biometric-auth.ts` — Biometric availability and authentication
- `lib/widget-bridge.ts` — Widget data formatting and native module calls

**Recommended Testing Stack for this Project:**
Given the Expo + React Native stack, the recommended approach would be:

**Unit Tests:**
- **Jest** (bundled with Expo) + **@testing-library/react-native**
- Test utilities, hooks, and service logic in isolation

**Integration Tests:**
- **MSW** (Mock Service Worker) to mock backend API responses
- Test `useQuery` hooks and service classes with mocked `fetch`

**E2E Tests:**
- **Maestro** or **Detox** for critical user journeys (login, add expense, view dashboard)

**Example test structure to adopt:**
```
__tests__/
  services/
    api.test.ts
    auth.test.ts
  hooks/
    use-transaction-filters.test.ts
    use-image-picker.test.ts
  lib/
    image-utils.test.ts
    biometric-auth.test.ts
```

**CI Integration:**
Add a test script to `package.json`:
```json
"scripts": {
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage"
}
```

---

*Testing analysis: 2026-04-29*
