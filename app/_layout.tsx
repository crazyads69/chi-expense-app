import { useEffect, useState } from 'react';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { TamaguiProvider, Theme, YStack, Spinner } from 'tamagui';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import * as Linking from 'expo-linking';

import config from '../tamagui.config';
import { useThemeStore } from '@/stores/theme';
import { useAuthStore } from '@/stores/auth';
import { authService } from '@/services/auth';
import { useSecurityStore } from '@/stores/security';
import { useBiometric } from '@/hooks/use-biometric';
import { BiometricPrompt } from '@/components/biometric-prompt';
import { ErrorBoundary } from '@/components/error-boundary';

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
  const { isBiometricEnabled, shouldRequireAuth, updateLastAuthenticated } = useSecurityStore();
  const { authenticate, isAvailable, biometryType } = useBiometric();
  const [showBiometricPrompt, setShowBiometricPrompt] = useState(false);
  const [biometricError, setBiometricError] = useState<string | null>(null);

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
      } else if (hasSession && isBiometricEnabled && shouldRequireAuth()) {
        setShowBiometricPrompt(true);
      }
    };

    initAuth();
  }, [isAuthenticated, segments]);

  const handleAuthenticate = async () => {
    setBiometricError(null);
    const success = await authenticate();
    if (success) {
      setShowBiometricPrompt(false);
      updateLastAuthenticated();
    } else {
      setBiometricError('Authentication failed. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor="$background">
        <Spinner size="large" color="$primary" />
      </YStack>
    );
  }

  return (
    <>
      {children}
      {showBiometricPrompt && (
        <BiometricPrompt
          biometryType={isAvailable ? biometryType : null}
          onAuthenticate={handleAuthenticate}
          onCancel={() => {
            setShowBiometricPrompt(false);
          }}
          error={biometricError}
        />
      )}
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });

  const systemColorScheme = useColorScheme();
  const { theme, followSystem } = useThemeStore();
  const { isAuthenticated } = useAuthStore();

  const activeTheme = followSystem
    ? (systemColorScheme ?? 'light')
    : theme;
  const router = useRouter();

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    const handleUrl = ({ url }: { url: string }) => {
      const parsed = Linking.parse(url);
      if (parsed.path === 'dashboard' || parsed.path === '/dashboard') {
        router.push('/(tabs)/dashboard');
      }
    };

    const subscription = Linking.addEventListener('url', handleUrl);

    Linking.getInitialURL().then((url) => {
      if (url) handleUrl({ url });
    });

    return () => subscription.remove();
  }, [router]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <TamaguiProvider config={config}>
      <Theme name={activeTheme}>
        <QueryClientProvider client={queryClient}>
          <SafeAreaProvider>
            <ErrorBoundary>
              <AuthGuard>
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="login" />
                  <Stack.Screen name="(tabs)" />
                </Stack>
              </AuthGuard>
            </ErrorBoundary>
            <StatusBar style={activeTheme === 'dark' ? 'light' : 'dark'} />
          </SafeAreaProvider>
        </QueryClientProvider>
      </Theme>
    </TamaguiProvider>
  );
}
