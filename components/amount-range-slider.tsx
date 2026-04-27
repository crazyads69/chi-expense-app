import { useState, useCallback } from 'react';
import { YStack, Text, XStack } from 'tamagui';
import { Input } from './input';

interface AmountRangeSliderProps {
  min: number;
  max: number;
  onChange: (range: { min: number; max: number }) => void;
  currency?: string;
}

export function AmountRangeSlider({
  min,
  max,
  onChange,
  currency = 'VND',
}: AmountRangeSliderProps) {
  const [minValue, setMinValue] = useState(min);
  const [maxValue, setMaxValue] = useState(max);

  const handleMinChange = useCallback(
    (value: string) => {
      const num = parseFloat(value) || 0;
      setMinValue(num);
      onChange({ min: num, max: maxValue });
    },
    [maxValue, onChange],
  );

  const handleMaxChange = useCallback(
    (value: string) => {
      const num = parseFloat(value) || 0;
      setMaxValue(num);
      onChange({ min: minValue, max: num });
    },
    [minValue, onChange],
  );

  const rangeWidth =
    maxValue > minValue
      ? Math.min(100, ((maxValue - minValue) / (maxValue || 1)) * 100)
      : 0;
  const rangeLeft =
    maxValue > 0 ? Math.min(100, (minValue / maxValue) * 100) : 0;

  return (
    <YStack gap={12}>
      <Text fontSize={14} fontWeight="600" color="$textSecondary">
        Amount Range ({currency})
      </Text>
      <XStack gap={12}>
        <YStack flex={1}>
          <Text fontSize={12} color="$textMuted" marginBottom={4}>
            Min
          </Text>
          <Input
            value={minValue.toString()}
            onChangeText={handleMinChange}
            keyboardType="numeric"
            placeholder="0"
          />
        </YStack>
        <YStack flex={1}>
          <Text fontSize={12} color="$textMuted" marginBottom={4}>
            Max
          </Text>
          <Input
            value={maxValue.toString()}
            onChangeText={handleMaxChange}
            keyboardType="numeric"
            placeholder="Any"
          />
        </YStack>
      </XStack>
      <YStack
        height={4}
        backgroundColor="$surface"
        borderRadius={2}
        position="relative"
        overflow="hidden"
      >
        <YStack
          position="absolute"
          height={4}
          backgroundColor="$primary"
          borderRadius={2}
          left={`${rangeLeft}%`}
          width={`${rangeWidth}%`}
          opacity={0.5}
        />
      </YStack>
    </YStack>
  );
}
