import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface NotificationPreferences {
  dailySummaryEnabled: boolean;
  dailySummaryTime: string;
  budgetAlertsEnabled: boolean;
  budgetThreshold: number;
}

interface NotificationState {
  pushToken: string | null;
  permissionsGranted: boolean;
  preferences: NotificationPreferences;
  isLoading: boolean;
  setPushToken: (token: string | null) => void;
  setPermissionsGranted: (granted: boolean) => void;
  setPreferences: (prefs: Partial<NotificationPreferences>) => void;
  setLoading: (loading: boolean) => void;
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  dailySummaryEnabled: true,
  dailySummaryTime: '21:00',
  budgetAlertsEnabled: true,
  budgetThreshold: 80,
};

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      pushToken: null,
      permissionsGranted: false,
      preferences: DEFAULT_PREFERENCES,
      isLoading: false,
      setPushToken: (pushToken) => set({ pushToken }),
      setPermissionsGranted: (permissionsGranted) => set({ permissionsGranted }),
      setPreferences: (prefs) =>
        set((state) => ({ preferences: { ...state.preferences, ...prefs } })),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'notification-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ preferences: state.preferences }),
    }
  )
);
