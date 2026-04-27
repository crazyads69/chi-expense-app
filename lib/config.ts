import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.apiUrl
  || process.env.EXPO_PUBLIC_API_URL
  || 'http://localhost:3000';

export const config = {
  apiUrl: API_URL,
  apiVersion: 'v1',
  getBaseUrl: () => `${API_URL}/api/${config.apiVersion}`,
};
