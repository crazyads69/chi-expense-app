# Phase 4 Plan: Fix Hardcoded Colors Outside Theme System Summary

**Phase:** 4
**Plan:** colors
**Subsystem:** UI / Theming
**Tags:** theming, tamagui, dark-mode, tech-debt
**Completed:** 2025-04-29

## Overview

Replaced 41+ hardcoded hex color values across 11 React Native components with Tamagui theme-aware tokens. Added an 8-color chart palette to the theme system for consistent data visualization across light and dark modes.

## Files Changed

| File | Changes |
|------|---------|
| `themes/colors.ts` | Added `chart1`–`chart8` tokens to light and dark themes (16 new color definitions) |
| `tamagui.config.ts` | Registered `chart1`–`chart8` tokens in Tamagui theme config (16 new mappings) |
| `components/category-distribution-chart.tsx` | Replaced `CHART_COLORS` array (8 hardcoded values) with theme-aware colors; replaced 3 `#FFFFFF` text/stroke colors; removed `#111111` fallback |
| `components/spending-trend-chart.tsx` | Replaced `lineColor`, `fillColor`, `endFillColor`, `verticalLinesColor`, `stripColor`, and `textColor` fallback with theme tokens |
| `components/month-picker.tsx` | Replaced `#2563EB`, `#F5F5F5`, `#FFFFFF`, `#111111`, and 2× `#666666` with theme tokens |
| `components/filter-chips.tsx` | Replaced 2× `#2563EB`, `#F5F5F5`, `#E5E5E5`, `#FFFFFF`, `#666666` with theme tokens |
| `components/image-picker-button.tsx` | Replaced `#000`, `#111111`, `#999999` with theme tokens |
| `components/search-bar.tsx` | Replaced 2× `#999999` with `theme.textMuted.val` |
| `components/filter-sheet.tsx` | Replaced `#666666` with `theme.textSecondary.val` |
| `components/offline-banner.tsx` | Replaced `#F59E0B` with `theme.warning.val` |
| `components/chart-tooltip.tsx` | Replaced `#666666` with `theme.textSecondary.val` |
| `components/biometric-prompt.tsx` | Replaced 2× `#2563EB` with `theme.primary.val` |
| `components/icon.tsx` | Replaced default `#111111` with `theme.textPrimary.val` fallback |

## Color Replacement Mapping

| Hardcoded Value | Theme Token | Occurrences |
|-----------------|-------------|-------------|
| `#2563EB` | `theme.primary.val` | 7 |
| `#10B981` | `theme.chart2.val` / `theme.success.val` | 1 |
| `#F59E0B` | `theme.warning.val` | 2 |
| `#EF4444` | `theme.chart4.val` / `theme.error.val` | 1 |
| `#666666` | `theme.textSecondary.val` | 5 |
| `#999999` | `theme.textMuted.val` | 4 |
| `#FFFFFF` | `theme.textInverse.val` | 5 |
| `#111111` | `theme.textPrimary.val` | 4 |
| `#F5F5F5` | `theme.surface.val` | 2 |
| `#E5E5E5` | `theme.border.val` | 1 |
| `#000` / `#000000` | `theme.textPrimary.val` | 1 |
| Various rgba values | Derived from `theme.primary.val` | 4 |

## Key Decisions

1. **Chart palette structure:** Added `chart1`–`chart8` as individual theme tokens rather than an array, because Tamagui themes expect flat string key-value pairs. Components construct the array at runtime via `useTheme()`.
2. **Dark mode chart colors:** Adjusted chart colors for dark mode to be slightly brighter/more saturated for better visibility against dark backgrounds (e.g., `chart1` changed from `#2563EB` to `#3B82F6`).
3. **RGBA derivation:** For `spending-trend-chart.tsx`, rgba strings are constructed dynamically by appending alpha hex codes to the theme primary color (e.g., `${theme.primary.val}1A` for 10% opacity).
4. **Fallback strategy:** All `useTheme()` accesses include a hardcoded fallback (e.g., `theme.primary?.val || '#2563EB'`) to ensure components render correctly even if theme initialization is delayed.

## Metrics

- **Duration:** ~8 minutes
- **Files modified:** 13
- **Color replacements:** 41+ hex values replaced
- **New theme tokens:** 16 (8 per theme)
- **TypeScript errors:** 0

## Verification

- [x] `npm run typecheck` passes with zero errors
- [x] All components import `useTheme` from `tamagui`
- [x] Chart colors are registered in both light and dark themes
- [x] No hardcoded hex values remain in modified components (except fallback defaults)

## Threat Flags

No new security surface introduced. Changes are purely presentational.

## Known Stubs

None. All color values are wired to the active theme.
