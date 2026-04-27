import { useState } from 'react';
import { YStack, Text, XStack } from 'tamagui';
import { PieChart } from 'react-native-gifted-charts';
import { useTheme } from 'tamagui';
import { ChartTooltip } from './chart-tooltip';

interface CategoryData {
  category: string;
  amount: number;
  percentage: number;
}

interface CategoryDistributionChartProps {
  data: CategoryData[];
  currency?: string;
}

const CHART_COLORS = [
  '#2563EB', // Blue
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#84CC16', // Lime
];

export function CategoryDistributionChart({ data, currency = 'VND' }: CategoryDistributionChartProps) {
  const theme = useTheme();
  const [selectedSlice, setSelectedSlice] = useState<CategoryData | null>(null);

  if (!data || data.length === 0) {
    return (
      <YStack alignItems="center" justifyContent="center" padding={48}>
        <Text fontSize={16} color="$textSecondary" textAlign="center">
          Not enough data for distribution
        </Text>
        <Text fontSize={14} color="$textMuted" textAlign="center" marginTop={8}>
          Add expenses in different categories
        </Text>
      </YStack>
    );
  }

  const pieData = data.map((item, index) => ({
    value: item.percentage,
    color: CHART_COLORS[index % CHART_COLORS.length],
    text: `${item.percentage}%`,
    textColor: '#FFFFFF',
    fontSize: 12,
    label: item.category,
    focused: selectedSlice?.category === item.category,
  }));

  const textColor = theme.textPrimary?.val || '#111111';

  return (
    <YStack gap={16}>
      <Text fontSize={16} fontWeight="600" color="$textPrimary">
        Category Distribution
      </Text>

      <YStack alignItems="center">
        <PieChart
          data={pieData}
          donut
          showText
          textColor="#FFFFFF"
          radius={120}
          innerRadius={60}
          innerCircleColor={theme.background?.val || '#FFFFFF'}
          focusOnPress
          onPress={(item: any, index: number) => {
            setSelectedSlice(data[index]);
          }}
          sectionAutoFocus
          strokeWidth={2}
          strokeColor="#FFFFFF"
        />
      </YStack>

      {/* Legend */}
      <YStack gap={8} paddingTop={8}>
        {data.map((item, index) => (
          <XStack key={item.category} alignItems="center" gap={8}>
            <YStack
              width={12}
              height={12}
              borderRadius={6}
              backgroundColor={CHART_COLORS[index % CHART_COLORS.length]}
            />
            <Text fontSize={14} color="$textPrimary" flex={1}>
              {item.category}
            </Text>
            <Text fontSize={14} color="$textSecondary">
              {item.amount.toLocaleString('vi-VN')} {currency}
            </Text>
            <Text fontSize={14} color="$textMuted" width={40} textAlign="right">
              {item.percentage}%
            </Text>
          </XStack>
        ))}
      </YStack>

      {selectedSlice && (
        <ChartTooltip
          label={selectedSlice.category}
          value={`${selectedSlice.amount.toLocaleString('vi-VN')} ${currency} (${selectedSlice.percentage}%)`}
          onClose={() => setSelectedSlice(null)}
        />
      )}
    </YStack>
  );
}
