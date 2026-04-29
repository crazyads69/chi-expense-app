import { useState } from 'react';
import { YStack, Text } from 'tamagui';
import { LineChart } from 'react-native-gifted-charts';
import { useTheme } from 'tamagui';
import { ChartTooltip } from './chart-tooltip';

interface TrendDataPoint {
  month: string;
  amount: number;
}

interface ChartDataPoint {
  value: number;
  label: string;
  dataPointText?: string;
}

interface SpendingTrendChartProps {
  data: TrendDataPoint[];
  currency?: string;
}

export function SpendingTrendChart({ data, currency = 'VND' }: SpendingTrendChartProps) {
  const theme = useTheme();
  const [selectedPoint, setSelectedPoint] = useState<TrendDataPoint | null>(null);

  if (!data || data.length === 0) {
    return (
      <YStack alignItems="center" justifyContent="center" padding={48}>
        <Text fontSize={16} color="$textSecondary" textAlign="center">
          Not enough data for trends
        </Text>
        <Text fontSize={14} color="$textMuted" textAlign="center" marginTop={8}>
          Add more expenses to see your spending trends
        </Text>
      </YStack>
    );
  }

  const chartData = data.map((point) => ({
    value: point.amount,
    label: point.month,
    dataPointText: `${(point.amount / 1000000).toFixed(1)}M`,
  }));

  const maxValue = Math.max(...data.map((d) => d.amount));
  const yAxisMax = Math.ceil(maxValue / 1000000) * 1000000;

  const textColor = theme.textPrimary?.val;
  const lineColor = theme.primary?.val || '#2563EB';
  const fillColor = theme.primary?.val
    ? `${theme.primary.val}1A`
    : 'rgba(37, 99, 235, 0.1)';
  const endFillColor = theme.primary?.val
    ? `${theme.primary.val}00`
    : 'rgba(37, 99, 235, 0)';
  const verticalLinesColor = theme.textPrimary?.val
    ? `${theme.textPrimary.val}1A`
    : 'rgba(0,0,0,0.1)';
  const stripColor = theme.primary?.val
    ? `${theme.primary.val}33`
    : 'rgba(37, 99, 235, 0.2)';

  return (
    <YStack gap={16}>
      <Text fontSize={16} fontWeight="600" color="$textPrimary">
        Spending Trend (Last {data.length} Months)
      </Text>

      <LineChart
        data={chartData}
        width={320}
        height={200}
        maxValue={yAxisMax}
        yAxisTextStyle={{ color: textColor, fontSize: 10 }}
        xAxisLabelTextStyle={{ color: textColor, fontSize: 10 }}
        yAxisLabelSuffix="M"
        yAxisLabelPrefix=""
        showValuesAsDataPointsText
        textColor={textColor}
        color={lineColor}
        startFillColor={fillColor}
        endFillColor={endFillColor}
        startOpacity={0.3}
        endOpacity={0.05}
        thickness={2}
        dataPointsColor={lineColor}
        dataPointsRadius={4}
        showVerticalLines
        verticalLinesColor={verticalLinesColor}
        focusEnabled
        onFocus={(item: ChartDataPoint) => {
          const point = data.find((d) => d.month === item.label);
          if (point) setSelectedPoint(point);
        }}
        stripColor={stripColor}
        stripWidth={2}
        stripHeight={200}
      />

      {selectedPoint && (
        <ChartTooltip
          label={selectedPoint.month}
          value={`${selectedPoint.amount.toLocaleString('vi-VN')} ${currency}`}
          onClose={() => setSelectedPoint(null)}
        />
      )}
    </YStack>
  );
}
