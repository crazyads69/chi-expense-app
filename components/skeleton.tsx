import { YStack, XStack } from 'tamagui';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  count?: number;
}

export function Skeleton({
  width = '100%',
  height = 16,
  borderRadius = 4,
  count = 1,
}: SkeletonProps) {
  return (
    <YStack gap={8} width="100%">
      {Array.from({ length: count }).map((_, i) => (
        <YStack
          key={i}
          width={width}
          height={height}
          backgroundColor="$surface"
          borderRadius={borderRadius}
          opacity={0.6}
        />
      ))}
    </YStack>
  );
}

export function SkeletonCard() {
  return (
    <YStack
      backgroundColor="$surface"
      borderWidth={1}
      borderColor="$borderSubtle"
      borderRadius={16}
      padding={24}
      gap={12}
      opacity={0.6}
    >
      <Skeleton width="60%" height={20} />
      <Skeleton width="40%" height={16} />
      <Skeleton width="80%" height={16} />
    </YStack>
  );
}
