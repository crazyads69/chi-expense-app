import { createTamagui } from 'tamagui';
import { config as tamaguiConfig } from '@tamagui/config';

import { colors } from './themes/colors';
import { tokens } from './themes/tokens';

const appConfig = createTamagui({
  ...tamaguiConfig,
  tokens,
  themes: {
    light: {
      background: colors.light.background,
      surface: colors.light.surface,
      surfaceElevated: colors.light.surfaceElevated,
      textPrimary: colors.light.textPrimary,
      textSecondary: colors.light.textSecondary,
      textMuted: colors.light.textMuted,
      textInverse: colors.light.textInverse,
      border: colors.light.border,
      borderSubtle: colors.light.borderSubtle,
      primary: colors.light.primary,
      primaryMuted: colors.light.primaryMuted,
      primaryPressed: colors.light.primaryPressed,
      error: colors.light.error,
      errorMuted: colors.light.errorMuted,
      success: colors.light.success,
      successMuted: colors.light.successMuted,
      warning: colors.light.warning,
      warningMuted: colors.light.warningMuted,
      chart1: colors.light.chart1,
      chart2: colors.light.chart2,
      chart3: colors.light.chart3,
      chart4: colors.light.chart4,
      chart5: colors.light.chart5,
      chart6: colors.light.chart6,
      chart7: colors.light.chart7,
      chart8: colors.light.chart8,
    },
    dark: {
      background: colors.dark.background,
      surface: colors.dark.surface,
      surfaceElevated: colors.dark.surfaceElevated,
      textPrimary: colors.dark.textPrimary,
      textSecondary: colors.dark.textSecondary,
      textMuted: colors.dark.textMuted,
      textInverse: colors.dark.textInverse,
      border: colors.dark.border,
      borderSubtle: colors.dark.borderSubtle,
      primary: colors.dark.primary,
      primaryMuted: colors.dark.primaryMuted,
      primaryPressed: colors.dark.primaryPressed,
      error: colors.dark.error,
      errorMuted: colors.dark.errorMuted,
      success: colors.dark.success,
      successMuted: colors.dark.successMuted,
      warning: colors.dark.warning,
      warningMuted: colors.dark.warningMuted,
      chart1: colors.dark.chart1,
      chart2: colors.dark.chart2,
      chart3: colors.dark.chart3,
      chart4: colors.dark.chart4,
      chart5: colors.dark.chart5,
      chart6: colors.dark.chart6,
      chart7: colors.dark.chart7,
      chart8: colors.dark.chart8,
    },
  },
  fonts: {
    heading: {
      family: 'Inter, InterBold, -apple-system, sans-serif',
      size: {
        1: 14,
        2: 20,
        3: 28,
      },
      weight: {
        4: '400',
        6: '600',
      },
      letterSpacing: {
        4: 0,
      },
      lineHeight: {
        1: 20,
        2: 28,
        3: 36,
      },
    },
    body: {
      family: 'Inter, -apple-system, sans-serif',
      size: {
        1: 14,
        2: 16,
      },
      weight: {
        4: '400',
        6: '600',
      },
      letterSpacing: {
        4: 0,
      },
      lineHeight: {
        1: 20,
        2: 24,
      },
    },
  },
});

export type AppConfig = typeof appConfig;

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default appConfig;
