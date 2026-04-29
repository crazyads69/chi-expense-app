# Coding Conventions

**Analysis Date:** 2026-04-29

## Naming Patterns

**Files:**
- Screens (routes): kebab-case matching the URL path (e.g., `privacy-policy.tsx`, `terms-of-service.tsx`)
- Components: kebab-case (e.g., `spending-trend-chart.tsx`, `filter-sheet.tsx`)
- Hooks: `use-{description}.ts` (e.g., `use-analytics.ts`, `use-transaction-filters.ts`)
- Stores: kebab-case noun (e.g., `auth.ts`, `security.ts`)
- Services: kebab-case noun (e.g., `api.ts`, `auth.ts`)
- Utilities: kebab-case noun (e.g., `image-utils.ts`, `widget-bridge.ts`, `biometric-auth.ts`)

**Functions:**
- camelCase for all functions and methods
- React components: PascalCase (e.g., `function SpendingTrendChart()`)
- Hooks: camelCase prefixed with `use` (e.g., `useAnalytics`, `useBiometric`)
- Event handlers: prefixed with `handle` (e.g., `handleSignIn`, `handleDelete`, `handleUpdate`)
- Async functions: same convention, no special prefix required

**Variables:**
- camelCase for variables and constants
- Boolean flags: prefixed with `is`, `has`, `show`, or `can` (e.g., `isLoading`, `hasActiveFilters`, `showToast`, `canAskAgain`)
- State setters: prefixed with `set` matching state name (e.g., `setLoading`, `setSelectedMonth`)

**Types:**
- Interfaces for props and state shapes: PascalCase, suffixed with `Props` or `State` (e.g., `ButtonProps`, `AuthState`, `FilterSheetProps`)
- Type aliases: rarely used; interfaces preferred
- Zustand store interfaces: suffixed with `State` (e.g., `AuthState`, `ThemeState`, `UIState`)

## Code Style

**Formatting:**
- Tool: Prettier ^3.4.0
- Config: `prettier.config.js`
  - `singleQuote: true`
  - `trailingComma: 'all'`
  - `printWidth: 100`
  - `tabWidth: 2`
  - `semi: true`

**Linting:**
- Tool: ESLint ^8.57.0 with `@typescript-eslint` plugins
- Config: `.eslintrc.js`
  - Extends: `eslint:recommended`, `@typescript-eslint/recommended`, `plugin:react/recommended`, `plugin:react-hooks/recommended`, `prettier`
  - `react/react-in-jsx-scope: off` (uses new JSX transform)
  - `@typescript-eslint/no-explicit-any: warn`
  - `@typescript-eslint/no-unused-vars: ['warn', { argsIgnorePattern: '^_' }]`
  - Ignores: `node_modules/`, `.expo/`, `dist/`, `*.config.js`

**TypeScript:**
- Strict mode enabled (`tsconfig.json`)
- JSX transform: `react-jsx`
- Path alias: `@/*` maps to `./*`
- No explicit return types on components or hooks (inferred from JSX)

## Import Organization

**Order observed:**
1. React and React Native imports
2. External library imports (Tamagui, Expo, Lucide icons)
3. Internal absolute imports via `@/*` alias (components, hooks, stores, services, lib)
4. Relative imports (only within `components/` for sibling imports)

**Examples:**
```typescript
import { useState, useEffect } from 'react';           // 1. React
import { YStack, Text } from 'tamagui';                // 2. External
import { useRouter } from 'expo-router';               // 2. External
import { Button } from '@/components/button';          // 3. Internal alias
import { api } from '@/services/api';                  // 3. Internal alias
import { useAuthStore } from '@/stores/auth';          // 3. Internal alias
import { FilterChips } from './filter-chips';          // 4. Relative (sibling)
```

**Path Aliases:**
- `@/components/*` → Components
- `@/hooks/*` → Custom hooks
- `@/stores/*` → Zustand stores
- `@/services/*` → Business services
- `@/lib/*` → Utilities and infrastructure

## Error Handling

**Patterns:**
- `services/api.ts`: Throws custom `ApiError` class for non-2xx responses. Special-cases 401 to clear token.
- `services/auth.ts`: Swallows exceptions and returns `{ error?: string }` result objects for UI consumption.
- Screens: Use `try/catch` with `showToast` from `useUIStore` for user-facing feedback.
- TypeScript `any` used sparingly in catch blocks (`catch (err: any)`), triggering lint warnings.

**Anti-pattern observed:** Empty catch blocks with ignored errors:
```typescript
catch {
  // Ignore signout errors
}
```

## Logging

**Framework:** `console` only. No structured logger, no remote error tracking (Sentry, Bugsnag, etc.).

**Patterns:**
- `console.log` for informational messages
- `console.error` for operation failures
- `console.warn` for non-fatal issues (e.g., widget bridge fallback)

## Comments

**When to Comment:**
- Minimal commenting observed. Code is generally self-descriptive.
- Comments used for:
  - JSDoc-style function descriptions in `lib/widget-bridge.ts`
  - Explaining platform-specific branches (`// iOS: ...`, `// Android: ...`)
  - TODO or fallback explanations (`// Fall through to legacy path`)

**JSDoc/TSDoc:**
- Not systematically used. Only `lib/widget-bridge.ts` contains JSDoc blocks.
- No `@param` or `@returns` tags observed elsewhere.

## Function Design

**Size:**
- Screen components are large (100–462 lines). `settings.tsx` is 462 lines, `transactions.tsx` is 427 lines.
- Components are small to medium (20–115 lines).
- Hooks are small to medium (22–115 lines).
- Services are small to medium (72–135 lines).

**Parameters:**
- Destructured props in components and hooks
- Optional props use `?:` with defaults in destructuring

**Return Values:**
- Components return JSX directly
- Hooks return objects with named fields (e.g., `UseBiometricReturn`)
- Services return Promises or result objects

## Module Design

**Exports:**
- Screens: `export default function ScreenName()`
- Components: `export function ComponentName()`
- Hooks: `export function useHookName()`
- Services: `export const serviceName = new ServiceClass()` (singleton pattern)
- Stores: `export const useStoreName = create<State>()(...)`
- Types: Inline in same file, no dedicated `types/` directory

**Barrel Files:**
- `stores/index.ts` exports commonly used stores (`useAuthStore`, `useThemeStore`, `useUIStore`)
- No barrel file for `components/`, `hooks/`, or `services/`

## Component Patterns

**Props Interface Naming:**
- Always suffix with `Props` (e.g., `ButtonProps`, `CardProps`, `OfflineBannerProps`)

**Default Props:**
- Set via destructuring defaults in function signature:
```typescript
export function Card({ children, variant = 'default', onPress }: CardProps)
```

**Styling:**
- Tamagui props used inline (no StyleSheet)
- Theme tokens referenced with `$` prefix (e.g., `$background`, `$primary`, `$textSecondary`)
- Hardcoded hex colors used sparingly for chart colors and brand accents

**Platform Checks:**
- `Platform.OS === 'ios'` or `Platform.OS === 'android'` used for platform branching
- No `Platform.select` style objects observed

---

*Convention analysis: 2026-04-29*
