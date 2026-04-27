import { YStack, XStack, Text } from 'tamagui';
import { Pressable } from 'react-native';
import { ScrollView } from 'react-native';

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
                  backgroundColor: isSelected ? '#2563EB' : '#F5F5F5',
                  borderWidth: 1,
                  borderColor: isSelected ? '#2563EB' : '#E5E5E5',
                }}
              >
                <Text
                  fontSize={14}
                  color={isSelected ? '#FFFFFF' : '#666666'}
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
