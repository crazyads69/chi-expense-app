import { useState } from 'react';
import { YStack, Text, XStack, ScrollView } from 'tamagui';
import { Pressable } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useTheme } from 'tamagui';
import { Button } from './button';

interface MonthPickerProps {
  selectedMonth: string;
  onSelect: (month: string) => void;
}

export function MonthPicker({ selectedMonth, onSelect }: MonthPickerProps) {
  const theme = useTheme();
  const [year, setYear] = useState(parseInt(selectedMonth.split('-')[0]));
  const [month, setMonth] = useState(parseInt(selectedMonth.split('-')[1]));

  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];

  const handlePrevYear = () => setYear((y) => y - 1);
  const handleNextYear = () => setYear((y) => y + 1);

  const handleSelectMonth = (m: number) => {
    const newMonth = `${year}-${String(m).padStart(2, '0')}`;
    onSelect(newMonth);
  };

  return (
    <YStack gap={16} padding={16}>
      <XStack justifyContent="space-between" alignItems="center">
        <Pressable onPress={handlePrevYear}>
          <ChevronLeft size={24} color={theme.textSecondary?.val || '#666666'} />
        </Pressable>
        <Text fontSize={18} fontWeight="600" color="$textPrimary">
          {year}
        </Text>
        <Pressable onPress={handleNextYear}>
          <ChevronRight size={24} color={theme.textSecondary?.val || '#666666'} />
        </Pressable>
      </XStack>

      <XStack flexWrap="wrap" gap={8}>
        {monthNames.map((name, index) => {
          const m = index + 1;
          const isSelected =
            year === parseInt(selectedMonth.split('-')[0]) &&
            m === parseInt(selectedMonth.split('-')[1]);

          return (
            <Pressable
              key={name}
              onPress={() => handleSelectMonth(m)}
              style={{
                width: '30%',
                paddingVertical: 12,
                borderRadius: 8,
                backgroundColor: isSelected
                  ? theme.primary?.val || '#2563EB'
                  : theme.surface?.val || '#F5F5F5',
                alignItems: 'center',
              }}
            >
              <Text
                fontSize={14}
                fontWeight={isSelected ? '600' : '400'}
                color={isSelected ? theme.textInverse?.val || '#FFFFFF' : theme.textPrimary?.val || '#111111'}
              >
                {name}
              </Text>
            </Pressable>
          );
        })}
      </XStack>
    </YStack>
  );
}
