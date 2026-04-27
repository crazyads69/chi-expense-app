import { YStack, Text, XStack } from 'tamagui';
import { X } from 'lucide-react-native';
import { Pressable } from 'react-native';

interface ChartTooltipProps {
  label: string;
  value: string;
  onClose: () => void;
}

export function ChartTooltip({ label, value, onClose }: ChartTooltipProps) {
  return (
    <YStack
      backgroundColor="$surfaceElevated"
      borderRadius={12}
      padding={16}
      gap={4}
      shadowColor="rgba(0,0,0,0.15)"
      shadowOffset={{ width: 0, height: 2 }}
      shadowRadius={8}
      elevation={4}
    >
      <XStack justifyContent="space-between" alignItems="center">
        <Text fontSize={14} fontWeight="600" color="$textPrimary">
          {label}
        </Text>
        <Pressable onPress={onClose} style={{ padding: 4 }}>
          <X size={16} color="#666666" />
        </Pressable>
      </XStack>
      <Text fontSize={16} fontWeight="600" color="$primary">
        {value}
      </Text>
    </YStack>
  );
}
