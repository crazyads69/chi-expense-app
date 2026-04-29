---
slug: remove-notifications
description: Remove all notification-related code since backend dropped the feature
created: 2025-04-29
---

# Remove Notifications

## Files to Delete
- services/notifications.ts
- stores/notifications.ts

## Files to Modify
- package.json — remove expo-notifications, expo-device dependencies
- app.json — remove expo-notifications plugin config, remove "remote-notification" from UIBackgroundModes
- app/_layout.tsx — remove notification imports, hooks, useEffects
- app/(tabs)/settings.tsx — remove notification imports, state, handlers, and UI Card section
- app/privacy-policy.tsx — remove notification-related bullet points

## Docs to Update
- .planning/codebase/STACK.md, INTEGRATIONS.md, ARCHITECTURE.md, CONCERNS.md

## Verify
- Type check passes: `npm run typecheck`
- Lint passes: `npm run lint`
- App builds without errors
