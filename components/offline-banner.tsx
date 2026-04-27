import { YStack, Text } from 'tamagui';
import { WifiOff } from 'lucide-react-native';

interface OfflineBannerProps {
  visible: boolean;
}

export function OfflineBanner({ visible }: OfflineBannerProps) {
  if (!visible) return null;

  return (
    <YStack
      backgroundColor="$warningMuted"
      paddingHorizontal={16}
      paddingVertical={8}
      flexDirection="row"
      alignItems="center"
      gap={8}
    >
      <WifiOff size={16} color="#F59E0B" />
      <Text fontSize={14} color="$warning">
        No internet connection. Some features may be unavailable.
      </Text>
    </YStack>
  );
}
