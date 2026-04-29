import { YStack, Text } from 'tamagui';
import { WifiOff } from 'lucide-react-native';
import { useTheme } from 'tamagui';

interface OfflineBannerProps {
  visible: boolean;
}

export function OfflineBanner({ visible }: OfflineBannerProps) {
  const theme = useTheme();

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
      <WifiOff size={16} color={theme.warning?.val || '#F59E0B'} />
      <Text fontSize={14} color="$warning">
        No internet connection. Some features may be unavailable.
      </Text>
    </YStack>
  );
}
