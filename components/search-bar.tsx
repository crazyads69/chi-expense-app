import { useState, useEffect, useCallback } from 'react';
import { YStack, Input } from 'tamagui';
import { Search, X } from 'lucide-react-native';
import { useTheme } from 'tamagui';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search transactions...',
  debounceMs = 300,
}: SearchBarProps) {
  const theme = useTheme();
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [localValue, debounceMs, onChange, value]);

  const handleClear = useCallback(() => {
    setLocalValue('');
    onChange('');
  }, [onChange]);

  return (
    <YStack position="relative">
      <Input
        value={localValue}
        onChangeText={setLocalValue}
        placeholder={placeholder}
        paddingLeft={40}
        paddingRight={localValue ? 40 : 16}
        borderRadius={12}
        height={48}
        fontSize={16}
        backgroundColor="$surface"
        borderColor="$border"
        borderWidth={1}
        color="$textPrimary"
      />
      <Search
        size={20}
        color={theme.textMuted?.val || '#999999'}
        style={{ position: 'absolute', left: 12, top: 14 }}
      />
      {localValue && (
        <YStack
          onPress={handleClear}
          position="absolute"
          right={12}
          top={12}
          padding={4}
        >
          <X size={16} color={theme.textMuted?.val || '#999999'} />
        </YStack>
      )}
    </YStack>
  );
}
