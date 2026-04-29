---
status: complete
slug: remove-notifications
description: Remove all notification-related code since backend dropped the feature
created: 2025-04-29
completed: 2025-04-29
---

# Summary: Remove Notifications

## What Changed

### Deleted Files
- `services/notifications.ts` — Notification service (push token, permissions, preferences)
- `stores/notifications.ts` — Zustand notification store

### Modified Files
- `package.json` — Removed `expo-notifications` and `expo-device` dependencies
- `app.json` — Removed `expo-notifications` plugin config; removed `remote-notification` from `UIBackgroundModes`
- `app/_layout.tsx` — Removed notification imports, hooks, and push token useEffects
- `app/(tabs)/settings.tsx` — Removed Notifications settings Card, notification state, handlers, and unused imports (`useEffect`, `Platform`, `Linking`, `DateTimePicker`, `Bell`, `Clock`, `AlertTriangle`)
- `app/privacy-policy.tsx` — Removed push notification and spending summary bullet points

### Documentation Updated
- `.planning/codebase/STACK.md` — Cleaned `expo-notifications` and `expo-device` references
- `.planning/codebase/INTEGRATIONS.md` — Removed Notifications section and API endpoints
- `.planning/codebase/ARCHITECTURE.md` — Removed `notificationService` and push token lifecycle
- `.planning/codebase/STRUCTURE.md` — Removed deleted files from directory listings
- `.planning/codebase/CONVENTIONS.md` — Removed `notifications.ts` naming examples
- `.planning/codebase/CONCERNS.md` — Removed notification token and storage concerns

## Verification
- ✅ TypeScript type check passes (`npm run typecheck`)
- ✅ No notification references remain in source code (excluding in-app "toast notifications" UI pattern)
- ✅ `package-lock.json` updated via `npm install --package-lock-only`
