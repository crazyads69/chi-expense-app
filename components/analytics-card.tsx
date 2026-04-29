import { YStack, Text } from 'tamagui';
import { Card } from './card';
import { type ReactNode } from 'react';

interface AnalyticsCardProps {
  title?: string;
  children: ReactNode;
  empty?: boolean;
}

export function AnalyticsCard({ title, children, empty = false }: AnalyticsCardProps) {
  if (empty) {
    return (
      <Card>
        <YStack alignItems="center" justifyContent="center" padding={48} gap={8}>
          <Text fontSize={16} color="$textSecondary" textAlign="center">
            Your spending story is just beginning
          </Text>
          <Text fontSize={14} color="$textMuted" textAlign="center">
            Add a few expenses and watch your trends emerge
          </Text>
        </YStack>
      </Card>
    );
  }

  return (
    <Card>
      <YStack gap={16}>
        {title && (
          <Text fontSize={16} fontWeight="600" color="$textPrimary">
            {title}
          </Text>
        )}
        {children}
      </YStack>
    </Card>
  );
}
