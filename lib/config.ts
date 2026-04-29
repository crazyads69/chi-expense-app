import Constants from 'expo-constants';

const envUrl = process.env.EXPO_PUBLIC_API_URL;
const extraUrl = Constants.expoConfig?.extra?.apiUrl;

// Production builds must have an explicit API URL
if (__DEV__ === false && !envUrl && !extraUrl) {
  throw new Error(
    'EXPO_PUBLIC_API_URL is required in production builds. ' +
    'Set it in your .env.production or app.json extra config.'
  );
}

const API_URL = extraUrl || envUrl || 'http://localhost:3000';

export const config = {
  apiUrl: API_URL,
  apiVersion: 'v1',
  getBaseUrl: () => `${API_URL}/api/${config.apiVersion}`,
};
