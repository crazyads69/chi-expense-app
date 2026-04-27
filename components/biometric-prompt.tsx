import { YStack, Text } from 'tamagui';
import { Button } from '@/components/button';
import { Fingerprint, ScanFace } from 'lucide-react-native';

interface BiometricPromptProps {
  biometryType: string | null;
  onAuthenticate: () => void;
  onCancel: () => void;
  error?: string | null;
}

export function BiometricPrompt({ biometryType, onAuthenticate, onCancel, error }: BiometricPromptProps) {
  const icon = biometryType === 'facial'
    ? <ScanFace size={48} color="#2563EB" />
    : <Fingerprint size={48} color="#2563EB" />;
  const label = biometryType === 'facial' ? 'Face ID' : 'Fingerprint';

  return (
    <YStack
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
      backgroundColor="rgba(0,0,0,0.85)"
      justifyContent="center"
      alignItems="center"
      padding={24}
      zIndex={999}
    >
      <YStack
        backgroundColor="$surface"
        borderRadius={16}
        padding={32}
        gap={16}
        alignItems="center"
        width="100%"
        maxWidth={320}
      >
        {icon}
        <Text fontSize={18} fontWeight="600" color="$textPrimary" textAlign="center">
          Authentication Required
        </Text>
        <Text fontSize={14} color="$textSecondary" textAlign="center">
          Use {label} to unlock Chi Expense
        </Text>

        {error && (
          <Text fontSize={14} color="$error" textAlign="center">
            {error}
          </Text>
        )}

        <YStack gap={8} width="100%">
          <Button variant="filled" size="md" onPress={onAuthenticate}>
            Authenticate
          </Button>
          <Button variant="ghost" size="md" onPress={onCancel}>
            Cancel
          </Button>
        </YStack>
      </YStack>
    </YStack>
  );
}
