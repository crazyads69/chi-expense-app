import { NativeModules, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface WidgetData {
  monthLabel: string;
  total: number;
  currency: string;
  count: number;
  trend?: number[];
}

const WIDGET_STORAGE_KEY = '@widget_data_v1';

/**
 * iOS: Writes to App Group UserDefaults and triggers WidgetKit reload
 * Android: Writes to SharedPreferences and broadcasts APPWIDGET_UPDATE
 */
export async function updateWidgetData(data: WidgetData): Promise<void> {
  // Always persist locally for reference
  await AsyncStorage.setItem(WIDGET_STORAGE_KEY, JSON.stringify(data));

  if (Platform.OS === 'ios') {
    await updateIOSWidget(data);
  } else {
    await updateAndroidWidget(data);
  }
}

/**
 * Force all widgets to refresh immediately.
 * Call after any transaction mutation or dashboard refetch.
 */
export async function reloadAllWidgets(): Promise<void> {
  if (Platform.OS === 'ios') {
    try {
      const { ChiExpenseWidgetModule } = NativeModules;
      if (ChiExpenseWidgetModule?.reloadAllTimelines) {
        await ChiExpenseWidgetModule.reloadAllTimelines();
      }
    } catch (e) {
      console.warn('[Widget] iOS reload failed:', e);
    }
  } else {
    try {
      const { ChiExpenseWidgetModule } = NativeModules;
      if (ChiExpenseWidgetModule?.requestWidgetUpdate) {
        await ChiExpenseWidgetModule.requestWidgetUpdate();
      }
    } catch (e) {
      console.warn('[Widget] Android reload failed:', e);
    }
  }
}

export async function getWidgetData(): Promise<WidgetData | null> {
  try {
    const raw = await AsyncStorage.getItem(WIDGET_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.error('[Widget] Failed to get widget data:', err);
    return null;
  }
}

// --- iOS Implementation ---

async function updateIOSWidget(data: WidgetData): Promise<void> {
  try {
    const { ChiExpenseWidgetModule } = NativeModules;
    if (ChiExpenseWidgetModule?.setWidgetData) {
      await ChiExpenseWidgetModule.setWidgetData({
        monthLabel: data.monthLabel,
        total: String(data.total),
        currency: data.currency,
        count: String(data.count),
        trend: JSON.stringify(data.trend ?? []),
      });
      // Trigger reload
      await reloadAllWidgets();
      return;
    }
  } catch (err) {
    console.warn('[Widget] iOS native module error:', err);
    // Fall through to legacy path
  }

  // Fallback: widget will update on next timeline refresh
  console.warn('[Widget] Native module not available, widget will update on next timeline refresh');
}

// --- Android Implementation ---

async function updateAndroidWidget(data: WidgetData): Promise<void> {
  try {
    const { ChiExpenseWidgetModule } = NativeModules;
    if (ChiExpenseWidgetModule?.setWidgetData) {
      await ChiExpenseWidgetModule.setWidgetData({
        monthLabel: data.monthLabel,
        total: String(data.total),
        currency: data.currency,
        count: String(data.count),
      });
      await reloadAllWidgets();
      return;
    }
  } catch (err) {
    console.warn('[Widget] Android native module error:', err);
    // Fall through
  }

  console.warn('[Widget] Native module not available, widget will update on next system refresh');
}
