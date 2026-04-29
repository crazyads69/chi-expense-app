import { useState, useEffect } from 'react';
import { Text } from 'tamagui';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  formatter?: (val: number) => string;
  fontSize?: number;
  fontWeight?: string;
  color?: string;
}

export function AnimatedNumber({
  value,
  duration = 800,
  formatter = (val) => val.toLocaleString('vi-VN'),
  fontSize = 24,
  fontWeight = '600',
  color = '$textPrimary',
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const startValue = displayValue;
    const diff = value - startValue;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startValue + diff * eased);
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return (
    <Text fontSize={fontSize} fontWeight={fontWeight as any} color={color as any}>
      {formatter(displayValue)} VND
    </Text>
  );
}
