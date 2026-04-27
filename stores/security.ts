import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SecurityState {
  isBiometricEnabled: boolean;
  lockTimeout: number; // minutes
  lastAuthenticatedAt: number | null;
  setBiometricEnabled: (enabled: boolean) => void;
  setLockTimeout: (minutes: number) => void;
  updateLastAuthenticated: () => void;
  shouldRequireAuth: () => boolean;
}

export const useSecurityStore = create<SecurityState>()(
  persist(
    (set, get) => ({
      isBiometricEnabled: false,
      lockTimeout: 5,
      lastAuthenticatedAt: null,
      setBiometricEnabled: (isBiometricEnabled) => set({ isBiometricEnabled }),
      setLockTimeout: (lockTimeout) => set({ lockTimeout }),
      updateLastAuthenticated: () => set({ lastAuthenticatedAt: Date.now() }),
      shouldRequireAuth: () => {
        const { isBiometricEnabled, lockTimeout, lastAuthenticatedAt } = get();
        if (!isBiometricEnabled) return false;
        if (!lastAuthenticatedAt) return true;
        const elapsed = (Date.now() - lastAuthenticatedAt) / 1000 / 60;
        return elapsed >= lockTimeout;
      },
    }),
    {
      name: 'security-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
