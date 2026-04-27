import { YStack } from 'tamagui';
import { type ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'compact' | 'interactive';
  onPress?: () => void;
}

export function Card({ children, variant = 'default', onPress }: CardProps) {
  const isCompact = variant === 'compact';
  const isInteractive = variant === 'interactive' || !!onPress;

  return (
    <YStack
      backgroundColor="$surface"
      borderWidth={1}
      borderColor="$borderSubtle"
      borderRadius={isCompact ? 8 : 16}
      padding={isCompact ? 12 : 24}
      {...(isInteractive && {
        pressStyle: { scale: 0.985, backgroundColor: '$surfaceElevated' },
        onPress,
        animation: 'quick',
      })}
    >
      {children}
    </YStack>
  );
}
