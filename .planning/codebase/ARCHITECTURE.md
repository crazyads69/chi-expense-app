<!-- refreshed: 2026-04-29 -->
# Architecture

**Analysis Date:** 2026-04-29

## System Overview

```text
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                        │
│  app/(tabs)/            components/                          │
│  Screens & Routing      Reusable UI Components               │
└────────┬──────────────────────────┬─────────────────────────┘
         │                          │
         ▼                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    Application Logic Layer                   │
│  hooks/                 stores/           services/          │
│  Custom React Hooks     Zustand Stores    Business Services  │
└────────┬──────────────────────────┬─────────────────────────┘
         │                          │
         ▼                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    Infrastructure Layer                      │
│  lib/                         Native Modules                 │
│  Auth Client, Config, Utils   iOS WidgetKit / Android Widget │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│  External Systems                                            │
│  Backend API (Vercel)                        OAuth Providers  │
└─────────────────────────────────────────────────────────────┘
```

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| AuthGuard | Route protection, biometric gating, session refresh | `app/_layout.tsx:34` |
| RootLayout | Provider composition, theme resolution, font loading | `app/_layout.tsx:99` |
| TabLayout | Bottom tab bar configuration and styling | `app/(tabs)/_layout.tsx` |
| api | HTTP client with Bearer auth, 401 handling, JSON parsing | `services/api.ts` |
| authService | Social sign-in orchestration, session refresh, sign-out | `services/auth.ts` |
| authClient | Better Auth SDK client with Expo deep-link plugin | `lib/auth-client.ts` |
| widget-bridge | Cross-platform home screen widget data sync | `lib/widget-bridge.ts` |

## Pattern Overview

**Overall:** Layered architecture with file-based routing and feature-colocated state.

**Key Characteristics:**
- File-based routing via Expo Router v4 — screens are routes by convention
- Screen components are default-export React functions in `app/`
- Reusable UI components are named exports in `components/`
- Business logic lives in `services/` (singleton classes) and `hooks/` (React hooks)
- State split between Zustand (client state) and TanStack Query (server state)
- Custom API wrapper adds auth headers and handles token expiration

## Layers

**Presentation Layer:**
- Purpose: Render UI and handle user interactions
- Location: `app/`, `components/`
- Contains: Screen components, reusable UI primitives, charts, modals
- Depends on: `hooks/`, `stores/`, `services/`
- Used by: Expo Router (rendered by framework)

**Application Logic Layer:**
- Purpose: Encapsulate business rules, state management, and data orchestration
- Location: `hooks/`, `stores/`, `services/`
- Contains: Zustand stores, custom hooks, service classes
- Depends on: `lib/`, external APIs
- Used by: Presentation layer screens and components

**Infrastructure Layer:**
- Purpose: Provide cross-cutting utilities and native bridges
- Location: `lib/`
- Contains: Auth client, config resolver, image utils, permissions, widget bridge, biometric auth
- Depends on: Native modules, Expo SDK packages
- Used by: Application logic layer

**Native Layer:**
- Purpose: Platform-specific widget implementations
- Location: `ios/ChiExpenseWidget/`, `android/app/src/main/java/.../widget/`
- Contains: Swift widget extension, Kotlin widget provider and module
- Depends on: iOS WidgetKit / Android AppWidgetManager
- Used by: `lib/widget-bridge.ts` via React Native bridge

## Data Flow

### Primary Request Path (Authenticated Data Fetch)

1. **Screen mounts** and calls `useQuery` or `useMutation` (`app/(tabs)/dashboard.tsx:35`)
2. **Hook** calls `api.get()` or `api.post()` (`services/api.ts:24`)
3. **API client** retrieves Bearer token from `secureStorage` (`services/api.ts:21`)
4. **API client** makes `fetch` request to backend with auth header (`services/api.ts:40`)
5. **Response** flows back through hook into TanStack Query cache
6. **Screen** re-renders with cached data

### Authentication Flow

1. **User taps sign-in** → `authService.signInWithGitHub()` (`services/auth.ts:14`)
2. **Auth service** calls `authClient.signIn.social()` with deep-link callback (`lib/auth-client.ts:38`)
3. **Better Auth** opens `expo-web-browser` for OAuth provider
4. **Provider redirects** to `chi-expense://` scheme
5. **Expo Router** handles deep link, plugin exchanges code for session
6. **Session stored** in SecureStore via custom storage adapter (`lib/auth-client.ts:23`)
7. **Auth service** calls `handleAuthSuccess()` to sync Zustand store (`services/auth.ts:79`)

### Widget Update Flow

1. **Dashboard data changes** → `useWidgetUpdater` effect triggers (`hooks/use-widget-updater.ts:14`)
2. **Widget bridge** formats data and writes to native module (`lib/widget-bridge.ts:18`)
3. **Native module** persists to App Group UserDefaults (iOS) or SharedPreferences (Android)
4. **Native module** triggers WidgetKit timeline reload or Android broadcast

## Key Abstractions

**Store Pattern:**
- Purpose: Encapsulate client state with persistence
- Examples: `stores/auth.ts`, `stores/theme.ts`, `stores/security.ts`
- Pattern: Zustand store with `persist` middleware backed by AsyncStorage

**Service Pattern:**
- Purpose: Encapsulate side effects and external communication
- Examples: `services/api.ts`, `services/auth.ts`
- Pattern: Singleton class instantiated once and exported as `const service = new Service()`

**Hook Pattern:**
- Purpose: Reusable stateful logic composition
- Examples: `hooks/use-analytics.ts`, `hooks/use-biometric.ts`, `hooks/use-image-picker.ts`
- Pattern: Custom hook that may compose other hooks, stores, and services

**Modal Pattern:**
- Purpose: Overlay UI for forms, pickers, and confirmations
- Examples: `app/(tabs)/transactions.tsx:336`, `app/(tabs)/settings.tsx:235`
- Pattern: Inline conditional rendering of absolute-positioned `YStack` overlay with `rgba(0,0,0,0.5)` backdrop

## Entry Points

**Application Entry:**
- Location: `expo-router/entry` (defined in `package.json` main field)
- Triggers: App launch by OS
- Responsibilities: Bootstraps Expo Router, renders `app/_layout.tsx`

**Root Layout Entry:**
- Location: `app/_layout.tsx`
- Triggers: Router initialization
- Responsibilities: Provider composition (Tamagui, QueryClient, SafeArea), AuthGuard, splash screen, font loading

**Route Index Entry:**
- Location: `app/index.tsx`
- Triggers: Deep link or initial route `/`
- Responsibilities: Redirects authenticated users to `/(tabs)/dashboard`

**Auth Entry:**
- Location: `app/login.tsx`
- Triggers: Unauthenticated access to protected routes
- Responsibilities: Renders GitHub/Apple sign-in buttons, delegates to `authService`

## Architectural Constraints

- **Threading:** Single-threaded JavaScript event loop. Heavy operations (image manipulation) are offloaded to native Expo modules.
- **Global state:** Zustand stores are module-level singletons created at import time. All stores are in `stores/` directory.
- **Circular imports:** No detected circular dependency chains between layers.
- **Navigation state:** Managed entirely by Expo Router; no custom navigation state management.
- **API coupling:** Screens directly import `api` from `services/api.ts`. There is no repository or data mapper abstraction between screens and HTTP client.
- **Image upload bypass:** `add.tsx` uses raw `fetch` with `FormData` for image uploads instead of the `api` service (`app/(tabs)/add.tsx:76`).

## Anti-Patterns

### Inline Modal Rendering

**What happens:** Modals are rendered as inline conditional JSX inside screen components rather than using a dedicated modal/routing system.
**Why it's wrong:** Clutters screen components with overlay logic, makes modals harder to test, and duplicates backdrop styling across screens.
**Do this instead:** Extract modal content into dedicated components. For critical flows, consider Expo Router modal routes (e.g., `(tabs)/transactions/edit.tsx`).

### Service Bypass for Image Uploads

**What happens:** `add.tsx` constructs its own `fetch` call for multipart image uploads instead of using the centralized `api` service.
**Why it's wrong:** Duplicates base URL resolution, skips auth token injection, and bypasses unified error handling.
**Do this instead:** Extend `services/api.ts` with a `postMultipart` method that handles `FormData`, auth headers, and error normalization.

### Direct Store Mutation in Services

**What happens:** `services/auth.ts` calls `useAuthStore.getState().setUser(...)` directly inside an async service method.
**Why it's wrong:** Tight coupling between service layer and state layer makes the service harder to unit test and reuse.
**Do this instead:** Return session data from `authService` and let the caller (hook or screen) update the store. Alternatively, create an auth hook that coordinates service calls and store updates.

## Error Handling

**Strategy:** Mixed strategy. API errors throw `ApiError`. Screens catch errors in `try/catch` and show toast notifications via `useUIStore`.

**Patterns:**
- `services/api.ts` throws `ApiError` for non-2xx responses and 401s
- `services/auth.ts` swallows errors and returns `{ error?: string }` objects for UI consumption
- Screens use `showToast` from `useUIStore` for user-facing error feedback

## Cross-Cutting Concerns

**Logging:** Console-based only. No structured logger or remote error tracking.

**Validation:** No centralized validation library. Input validation is manual and ad-hoc (e.g., `add.tsx` checks `inputText.trim()`, `transaction-form.tsx` checks required fields).

**Authentication:** Dual-token approach. Better Auth manages session cookies stored in SecureStore. A separate Bearer token (`auth-token`) is used for API requests. Biometric auth gates app access after session timeout.

**Theming:** Tamagui theme tokens resolved at runtime. `useThemeStore` persists user preference. Root layout computes `activeTheme` by combining system color scheme with user override.

**Offline Awareness:** `useNetworkStatus` hook provides `isOffline` flag. Screens show `OfflineBanner` when offline. Mutations do not queue for retry when offline.

---

*Architecture analysis: 2026-04-29*
