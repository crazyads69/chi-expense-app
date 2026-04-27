import { Button as TamaguiButton, Text, Spinner } from 'tamagui';
import { useCallback } from 'react';
import * as Haptics from 'expo-haptics';

type ButtonVariant = 'filled' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  destructive?: boolean;
}

export function Button({
  children,
  variant = 'filled',
  size = 'md',
  onPress,
  disabled = false,
  loading = false,
  destructive = false,
}: ButtonProps) {
  const handlePress = useCallback(() => {
    if (disabled || loading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  }, [disabled, loading, onPress]);

  const sizeStyles = {
    sm: { paddingHorizontal: 8, paddingVertical: 8, minHeight: 36, fontSize: 14 },
    md: { paddingHorizontal: 16, paddingVertical: 8, minHeight: 44, fontSize: 14 },
    lg: { paddingHorizontal: 24, paddingVertical: 16, minHeight: 48, fontSize: 16 },
  };

  const s = sizeStyles[size];

  return (
    <TamaguiButton
      onPress={handlePress}
      disabled={disabled || loading}
      opacity={disabled ? 0.5 : 1}
      pressStyle={{ scale: 0.97 }}
      animation="quick"
      borderRadius={8}
      minHeight={s.minHeight}
      paddingHorizontal={s.paddingHorizontal}
      paddingVertical={s.paddingVertical}
      backgroundColor={
        variant === 'filled'
          ? destructive
            ? '$error'
            : '$primary'
          : 'transparent'
      }
      borderWidth={variant === 'outline' ? 1 : 0}
      borderColor={destructive ? '$error' : '$primary'}
      pressTheme
    >
      {loading ? (
        <Spinner color={variant === 'filled' ? '$textInverse' : '$primary'} size="small" />
      ) : typeof children === 'string' ? (
        <Text
          color={
            variant === 'filled'
              ? '$textInverse'
              : destructive
                ? '$error'
                : '$primary'
          }
          fontSize={s.fontSize}
          fontWeight="600"
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </TamaguiButton>
  );
}
