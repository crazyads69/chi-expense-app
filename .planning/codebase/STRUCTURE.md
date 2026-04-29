# Codebase Structure

**Analysis Date:** 2026-04-29

## Directory Layout

```
[project-root]/
├── app/                    # Expo Router screens and routes
│   ├── (tabs)/             # Tab group layout and screens
│   ├── _layout.tsx         # Root layout with providers
│   ├── index.tsx           # Route index (redirects to dashboard)
│   ├── login.tsx           # Authentication screen
│   ├── privacy-policy.tsx  # Legal page
│   └── terms-of-service.tsx # Legal page
├── components/             # Reusable UI components
├── hooks/                  # Custom React hooks
├── lib/                    # Infrastructure utilities and native bridges
├── services/               # Business service classes
├── stores/                 # Zustand state stores
├── themes/                 # Tamagui theme configuration
├── assets/                 # Images, icons, splash screens
├── ios/                    # iOS native code (widget extension)
├── android/                # Android native code (widget module)
├── .planning/codebase/     # Codebase analysis documents
├── app.json                # Expo app configuration
├── tamagui.config.ts       # Tamagui design system config
├── tsconfig.json           # TypeScript configuration
├── babel.config.js         # Babel configuration
├── .eslintrc.js            # ESLint rules
└── package.json            # Dependencies and scripts
```

## Directory Purposes

**`app/`:**
- Purpose: Expo Router file-based routing
- Contains: Screen components, layout wrappers, route-specific logic
- Key files: `app/_layout.tsx`, `app/(tabs)/_layout.tsx`, `app/login.tsx`

**`components/`:**
- Purpose: Reusable presentational components
- Contains: UI primitives (Button, Input, Card), charts, form components, overlays
- Key files: `components/button.tsx`, `components/card.tsx`, `components/spending-trend-chart.tsx`

**`hooks/`:**
- Purpose: Reusable stateful logic and data fetching hooks
- Contains: Custom hooks that compose stores, services, and React primitives
- Key files: `hooks/use-analytics.ts`, `hooks/use-biometric.ts`, `hooks/use-image-picker.ts`

**`lib/`:**
- Purpose: Infrastructure utilities and native bridge code
- Contains: Auth client initialization, config resolution, image processing, permissions, widget bridge, biometric checks
- Key files: `lib/auth-client.ts`, `lib/config.ts`, `lib/widget-bridge.ts`, `lib/biometric-auth.ts`

**`services/`:**
- Purpose: Business service classes that orchestrate side effects
- Contains: API client, auth orchestration, and business logic
- Key files: `services/api.ts`, `services/auth.ts`

**`stores/`:**
- Purpose: Zustand client-state stores
- Contains: Auth, theme, UI, and security stores
- Key files: `stores/auth.ts`, `stores/theme.ts`, `stores/ui.ts`

**`themes/`:**
- Purpose: Tamagui design tokens and color definitions
- Contains: Color palettes for light/dark modes, spacing/size/radius tokens
- Key files: `themes/colors.ts`, `themes/tokens.ts`

**`assets/`:**
- Purpose: Static images and app branding
- Contains: App icons, splash screens, favicon

**`ios/`:**
- Purpose: iOS native project files and widget extension
- Contains: Swift widget implementation, entitlements, Objective-C module bridge
- Key files: `ios/ChiExpenseWidget/ChiExpenseWidget.swift`, `ios/ChiExpenseWidget/ChiExpenseWidgetModule.swift`

**`android/`:**
- Purpose: Android native project files and widget module
- Contains: Kotlin widget provider, widget module, layout XML, drawable resources
- Key files: `android/app/src/main/java/com/chiexpense/app/widget/ChiExpenseWidgetModule.kt`, `android/app/src/main/res/layout/widget_layout.xml`

## Key File Locations

**Entry Points:**
- `package.json` main field: `expo-router/entry` — Framework bootstraps here
- `app/_layout.tsx` — Root layout, provider composition, auth guard
- `app/index.tsx` — Default route, redirects to dashboard

**Configuration:**
- `app.json` — Expo manifest (bundle ID, scheme, plugins, permissions)
- `tamagui.config.ts` — Design system configuration (themes, fonts, tokens)
- `tsconfig.json` — TypeScript paths (`@/*` alias), strict mode
- `babel.config.js` — Expo preset + Reanimated plugin
- `.eslintrc.js` — Lint rules for React Native TypeScript

**Core Logic:**
- `services/api.ts` — Centralized HTTP client
- `services/auth.ts` — Authentication orchestration
- `lib/auth-client.ts` — Better Auth client setup
- `lib/config.ts` — Runtime environment configuration

**Testing:**
- Not detected. No test files, test config, or testing framework present.

## Naming Conventions

**Files:**
- Screens: kebab-case matching route name (e.g., `dashboard.tsx`, `privacy-policy.tsx`)
- Components: kebab-case (e.g., `spending-trend-chart.tsx`, `filter-sheet.tsx`)
- Hooks: `use-{description}.ts` (e.g., `use-analytics.ts`, `use-image-picker.ts`)
- Stores: kebab-case noun (e.g., `auth.ts`)
- Services: kebab-case noun (e.g., `api.ts`, `auth.ts`)
- Utilities: kebab-case noun (e.g., `image-utils.ts`, `widget-bridge.ts`)

**Directories:**
- Route groups: parentheses grouping (e.g., `(tabs)/`)
- Feature folders: kebab-case plural (e.g., `components/`, `hooks/`, `stores/`)

**Exports:**
- Screens: `export default function ScreenName()`
- Components: `export function ComponentName()`
- Hooks: `export function useHookName()`
- Services: `export const serviceName = new ServiceClass()`
- Stores: `export const useStoreName = create<State>()(...)`

## Where to Add New Code

**New Screen / Route:**
- Add file to `app/(tabs)/` for tab routes
- Add file to `app/` root for modal or top-level routes
- Update `app/(tabs)/_layout.tsx` to register new tab if applicable

**New Component:**
- Add to `components/` directory
- Use kebab-case filename
- Export named function
- Import Tamagui primitives and compose from existing components

**New Service:**
- Add to `services/` directory
- Create class implementing an interface
- Export singleton instance
- Consume in hooks or screens, not directly in components

**New Store:**
- Add to `stores/` directory
- Use Zustand with `persist` middleware if persistence is needed
- Export store hook and any derived storage utilities
- Add to `stores/index.ts` barrel file if widely used

**New Hook:**
- Add to `hooks/` directory
- Prefix with `use-`
- Encapsulate related logic; compose existing hooks, stores, and services

**New Utility / Bridge:**
- Add to `lib/` directory
- Keep platform-specific code isolated (e.g., `if (Platform.OS === 'ios')`)

**New Theme Token:**
- Add colors to `themes/colors.ts`
- Map colors to Tamagui theme keys in `tamagui.config.ts`
- Add spacing/size tokens to `themes/tokens.ts`

## Special Directories

**`ios/` and `android/`:**
- Purpose: Native code for home screen widgets
- Generated: Partially (managed by Expo prebuild, but widget code is custom)
- Committed: Yes — widget source code is custom and version-controlled
- Note: These directories contain hand-written Swift and Kotlin for the widget bridge

**`.expo/`:**
- Purpose: Expo tooling cache and generated types
- Generated: Yes — created by Expo CLI
- Committed: No — listed in `.gitignore`

**`store/metadata.json`:**
- Purpose: App Store listing metadata (title, description, keywords, release notes)
- Languages: en-US, vi
- Used by: EAS submission or CI pipeline

---

*Structure analysis: 2026-04-29*
