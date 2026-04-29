import { YStack, XStack, Text } from 'tamagui';
import { Pressable } from 'react-native';
import { ScrollView } from 'react-native';
import { useTheme } from 'tamagui';

interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

interface FilterChipsProps {
  options: FilterOption[];
  selected: string[];
  onSelect: (values: string[]) => void;
  title?: string;
}

export function FilterChips({
  options,
  selected,
  onSelect,
  title,
}: FilterChipsProps) {
  const theme = useTheme();

  const toggleValue = (value: string) => {
    if (selected.includes(value)) {
      onSelect(selected.filter((v) => v !== value));
    } else {
      onSelect([...selected, value]);
    }
  };

  return (
    <YStack gap={8}>
      {title && (
        <Text fontSize={14} fontWeight="600" color="$textSecondary">
          {title}
        </Text>
      )}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 4 }}
      >
        <XStack gap={8}>
          {options.map((option) => {
            const isSelected = selected.includes(option.value);
            return (
              <Pressable
                key={option.value}
                onPress={() => toggleValue(option.value)}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 16,
                  backgroundColor: isSelected
                    ? theme.primary?.val || '#2563EB'
                    : theme.surface?.val || '#F5F5F5',
                  borderWidth: 1,
                  borderColor: isSelected
                    ? theme.primary?.val || '#2563EB'
                    : theme.border?.val || '#E5E5E5',
                }}
              >
                <Text
                  fontSize={14}
                  color={isSelected ? theme.textInverse?.val || '#FFFFFF' : theme.textSecondary?.val || '#666666'}
                  fontWeight={isSelected ? '600' : '400'}
                >
                  {option.label}
                  {option.count !== undefined && ` (${option.count})`}
                </Text>
              </Pressable>
            );
          })}
        </XStack>
      </ScrollView>
    </YStack>
  );
}
