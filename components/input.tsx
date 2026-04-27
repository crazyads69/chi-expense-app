import { useState } from 'react';
import { YStack, Text, Input as TamaguiInput } from 'tamagui';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  disabled?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
}

export function Input({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  disabled = false,
  multiline = false,
  numberOfLines = 1,
}: InputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <YStack width="100%" gap={4}>
      {label && (
        <Text fontSize={14} fontWeight="600" color="$textSecondary">
          {label}
        </Text>
      )}
      <TamaguiInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="$$textMuted"
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        editable={!disabled}
        opacity={disabled ? 0.5 : 1}
        borderWidth={focused ? 1.5 : error ? 1.5 : 1}
        borderColor={error ? '$error' : focused ? '$primary' : '$border'}
        backgroundColor={error ? '$errorMuted' : '$surface'}
        borderRadius={8}
        paddingHorizontal={16}
        paddingVertical={14}
        fontSize={16}
        color="$textPrimary"
        minHeight={multiline ? numberOfLines * 24 : 48}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        multiline={multiline}
        numberOfLines={numberOfLines}
      />
      {error && (
        <Text fontSize={14} color="$error">
          {error}
        </Text>
      )}
    </YStack>
  );
}
