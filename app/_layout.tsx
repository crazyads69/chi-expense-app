import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { TamaguiProvider, Theme } from 'tamagui';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';

import config from '../tamagui.config';
import { useThemeStore } from '@/stores/theme';
import { useAuthStore } from '@/stores/auth';
import { authService } from '@/services/auth';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    },
  },
});

function AuthGuard({ children }: { children: React.ReactNode }) {
  const segments = useSegments();
  const router = useRouter();
  const { isAuthenticated, isLoading, setLoading } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      const hasSession = await authService.refreshSession();
      setLoading(false);

      const inAuthGroup = segments[0] === 'login';

      if (!hasSession && !inAuthGroup) {
        router.replace('/login');
      } else if (hasSession && inAuthGroup) {
        router.replace('/(tabs)/dashboard');
      }
    };

    initAuth();
  }, [isAuthenticated, segments]);

  return <>{children}</>;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });

  const systemColorScheme = useColorScheme();
  const { theme, followSystem } = useThemeStore();

  const activeTheme = followSystem
    ? (systemColorScheme ?? 'light')
    : theme;

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <TamaguiProvider config={config}>
      <Theme name={activeTheme}>
        <QueryClientProvider client={queryClient}>
          <SafeAreaProvider>
            <AuthGuard>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="login" />
                <Stack.Screen name="(tabs)" />
              </Stack>
            </AuthGuard>
            <StatusBar style={activeTheme === 'dark' ? 'light' : 'dark'} />
          </SafeAreaProvider>
        </QueryClientProvider>
      </Theme>
    </TamaguiProvider>
  );
}
