import { createAuthClient } from 'better-auth/client';
import { expoClient } from '@better-auth/expo/client';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { config } from './config';

// In-memory cache with SecureStore persistence
const memoryCache: Record<string, string> = {};

// Load existing data from SecureStore on init
(async () => {
  try {
    const keys = ['chi-expense_cookie', 'chi-expense_session_data'];
    for (const key of keys) {
      const value = await SecureStore.getItemAsync(key);
      if (value) memoryCache[key] = value;
    }
  } catch (err) {
    console.error('[Auth] Failed to load session from SecureStore:', err);
  }
})();

const storage = {
  getItem: (key: string): string | null => {
    return memoryCache[key] || null;
  },
  setItem: (key: string, value: string): void => {
    memoryCache[key] = value;
    // Async persistence
    SecureStore.setItemAsync(key, value).catch((err) => {
      console.error('[Auth] SecureStore setItem failed:', err);
    });
  },
  removeItem: (key: string): void => {
    delete memoryCache[key];
    SecureStore.deleteItemAsync(key).catch((err) => {
      console.error('[Auth] SecureStore deleteItem failed:', err);
    });
  },
};

export const authClient = createAuthClient({
  baseURL: config.apiUrl,
  basePath: '/api/auth',
  plugins: [
    expoClient({
      scheme: 'chi-expense',
      storagePrefix: 'chi-expense',
      storage,
    }),
  ],
  fetchOptions: {
    headers: {
      'x-expo-native': Platform.OS,
    },
  },
});

export type AuthClient = typeof authClient;
