import { useEffect, useState } from 'react';
import { YStack, Text } from 'tamagui';
import { useRouter } from 'expo-router';
import { Github, Apple } from 'lucide-react-native';
import { Button } from '@/components/button';
import { authService } from '@/services/auth';
import { useAuthStore } from '@/stores/auth';
import { useTheme } from 'tamagui';

export default function LoginScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { isAuthenticated, isLoading } = useAuthStore();
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleGitHubSignIn = async () => {
    setError(null);
    setLoadingProvider('github');
    const result = await authService.signInWithGitHub();
    setLoadingProvider(null);
    if (result.error) {
      setError(result.error);
    }
  };

  const handleAppleSignIn = async () => {
    setError(null);
    setLoadingProvider('apple');
    const result = await authService.signInWithApple();
    setLoadingProvider(null);
    if (result.error) {
      setError(result.error);
    }
  };

  if (isLoading) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor="$background">
        <Text color="$textSecondary">Loading...</Text>
      </YStack>
    );
  }

  return (
    <YStack
      flex={1}
      justifyContent="center"
      alignItems="center"
      backgroundColor="$background"
      padding={24}
      gap={24}
    >
      <YStack gap={8} alignItems="center">
        <Text fontSize={28} fontWeight="600" color="$textPrimary" textAlign="center">
          Chi Expense
        </Text>
        <Text fontSize={14} color="$textSecondary" textAlign="center">
          Log expenses in under 2 seconds
        </Text>
      </YStack>

      <YStack width="100%" gap={12} maxWidth={320}>
        <Button
          variant="filled"
          size="lg"
          onPress={handleGitHubSignIn}
          loading={loadingProvider === 'github'}
          disabled={!!loadingProvider}
        >
          Sign in with GitHub
        </Button>

        <Button
          variant="filled"
          size="lg"
          onPress={handleAppleSignIn}
          loading={loadingProvider === 'apple'}
          disabled={!!loadingProvider}
        >
          Sign in with Apple
        </Button>
      </YStack>

      {error && (
        <Text fontSize={14} color="$error" textAlign="center">
          {error}
        </Text>
      )}

      <Text fontSize={12} color="$textMuted" textAlign="center" maxWidth={280}>
        By signing in, you agree to our Terms of Service and Privacy Policy
      </Text>
    </YStack>
  );
}
