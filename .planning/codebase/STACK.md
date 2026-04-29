# Technology Stack

**Analysis Date:** 2026-04-29

## Languages

**Primary:**
- TypeScript ~5.7.0 — All application logic, components, and services
- JSX (React) — UI rendering via `react-jsx` transform

**Secondary:**
- JavaScript — Configuration files only (`babel.config.js`, `.eslintrc.js`)
- JSON — Manifest and config files (`app.json`, `package.json`)
- Swift / Objective-C — iOS widget native module (`ios/ChiExpenseWidget/`)
- Kotlin — Android widget native module (`android/app/src/main/java/.../widget/`)

## Runtime

**Environment:**
- React Native 0.76.9
- Expo SDK ~52.0.0
- Hermes engine (default for Expo SDK 52)
- New Architecture (Fabric + TurboModules) enabled for both iOS and Android via `expo-build-properties`

**Package Manager:**
- npm (inferred from `package.json` presence)
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- **Expo** ~52.0.0 — Universal React Native development framework
- **Expo Router** ~4.0.0 — File-based routing for native navigation
- **React** 18.3.1 — UI library

**UI Framework:**
- **Tamagui** ^1.120.0 — Universal UI kit with design system
  - `@tamagui/core` ^1.120.0 — Core styling engine
  - `@tamagui/config` ^1.120.0 — Base configuration tokens
  - `@tamagui/font-inter` — Inter font family

**State Management:**
- **Zustand** ^5.0.0 — Lightweight global state
  - `zustand/middleware` — `persist` and `createJSONStorage` for AsyncStorage-backed persistence

**Data Fetching & Caching:**
- **TanStack Query (React Query)** ^5.60.0 — Server state caching and synchronization
  - Default stale time: 5 minutes
  - Default retry: 2 attempts
  - Used in screens and custom hooks (`useAnalytics`, dashboard, transactions)

**Authentication:**
- **Better Auth** ^1.6.2 — Authentication framework
  - `@better-auth/expo` ^1.0.0 — Expo-specific client plugin with deep-link callback handling

**Charts & Visualization:**
- **react-native-gifted-charts** ^1.4.76 — Line charts and pie/donut charts
  - `LineChart` for spending trends (`components/spending-trend-chart.tsx`)
  - `PieChart` for category distribution (`components/category-distribution-chart.tsx`)

**Animation:**
- **react-native-reanimated** ~3.16.0 — Native-driven animations
- **react-native-gesture-handler** ~2.20.0 — Gesture handling

**Icons:**
- **lucide-react-native** ^0.460.0 — Icon library

## Key Dependencies

**Critical Native Modules:**
- `expo-secure-store` ~14.0.0 — Encrypted key-value storage for auth tokens and session data
- `expo-local-authentication` ~15.0.2 — Face ID / fingerprint biometric authentication
- `expo-image-picker` ~16.0.0 — Camera and photo library access
- `expo-image-manipulator` ~13.0.0 — Image resizing and compression
- `expo-web-browser` ~14.0.2 — In-app browser for OAuth flows
- `expo-linking` ~7.0.5 — Deep linking and URL handling
- `expo-haptics` ~14.0.0 — Haptic feedback
- `expo-media-library` ~17.0.0 — Media library permissions
- `expo-device` ~7.0.3 — Device information
- `expo-splash-screen` ~0.29.24 — Splash screen management
- `expo-status-bar` ~2.0.0 — Status bar styling
- `expo-font` ~13.0.0 — Custom font loading
- `expo-asset` ~11.0.0 — Asset bundling
- `expo-build-properties` ~0.13.3 — Native build property configuration

**Infrastructure:**
- `@react-native-async-storage/async-storage` 1.23.1 — Unencrypted persistent storage for app state
- `@react-native-community/netinfo` 11.4.1 — Network connectivity detection
- `@react-native-community/datetimepicker` 8.2.0 — Native date/time picker
- `react-native-safe-area-context` 4.12.0 — Safe area insets
- `react-native-screens` ~4.4.0 — Native screen containers
- `react-native-svg` 15.8.0 — SVG rendering (used by charts and icons)
- `react-native-linear-gradient` ^2.8.3 — Gradient backgrounds

**Utilities:**
- `jose` ^6.2.2 — JWT handling (used implicitly by Better Auth flows)

## Configuration

**TypeScript:**
- `tsconfig.json` extends `expo/tsconfig.base`
- Strict mode enabled
- Path alias: `@/*` maps to `./*`
- `baseUrl`: `.`

**Babel:**
- Preset: `babel-preset-expo`
- Plugin: `react-native-reanimated/plugin` (required for Reanimated worklets)

**ESLint:**
- `.eslintrc.js` — Standard React Native TypeScript setup
  - Extends: `eslint:recommended`, `@typescript-eslint/recommended`, `plugin:react/recommended`, `plugin:react-hooks/recommended`, `prettier`
  - Rules: `@typescript-eslint/no-explicit-any` = warn, `no-unused-vars` with `_` prefix ignore
  - Parser options: ES2022, module, JSX

**Prettier:**
- Listed in devDependencies (^3.4.0)
- Config: `prettier.config.js`
  - `singleQuote: true`, `trailingComma: 'all'`, `printWidth: 100`, `tabWidth: 2`, `semi: true`
- Integrated via `eslint-config-prettier`

**Expo Configuration (`app.json`):**
- App name: Chi Expense
- Bundle ID: `com.chiexpense.app`
- Scheme: `chi-expense`
- Orientation: portrait
- UI style: automatic (light/dark)
- New Architecture enabled for both iOS and Android via `expo-build-properties`
- Typed routes experiment enabled
- iOS supports tablet, Face ID/Touch ID, camera, photo library
- Android permissions: Camera, storage, biometric, boot completed

**Environment:**
- `.env.production` — `EXPO_PUBLIC_API_URL=https://chi-expense.vercel.app`
- `.env.staging` — `EXPO_PUBLIC_API_URL=https://staging.chi-expense.vercel.app`
- Fallback API URL: `http://localhost:3000`

## Platform Requirements

**Development:**
- Node.js (version not specified; Expo SDK 52 typically requires Node 18+)
- Expo CLI (`npx expo start`)

**Production:**
- iOS: Supports tablet, Face ID/Touch ID, camera, photo library
- Android: Camera, storage, biometric, boot completed permissions
- Deployment target: Likely EAS (Expo Application Services) based on `eas.projectId` references

## Native Widget Integration

**iOS WidgetKit / Android App Widget:**
- Custom native module: `ChiExpenseWidgetModule`
- Bridge file: `lib/widget-bridge.ts`
- Writes expense summary data to App Group UserDefaults (iOS) or SharedPreferences (Android)
- Triggered automatically via `useWidgetUpdater` hook on dashboard data changes
- iOS entitlements: App Group `group.com.chiexpense.app`
- Android: Kotlin widget provider with PendingIntent deep-link to `chi-expense://dashboard`

---

*Stack analysis: 2026-04-29*
