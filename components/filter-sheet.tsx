import { YStack, Text, XStack } from 'tamagui';
import { Button } from './button';
import { FilterChips } from './filter-chips';
import { AmountRangeSlider } from './amount-range-slider';
import { X } from 'lucide-react-native';

interface FilterSheetProps {
  visible: boolean;
  onClose: () => void;
  categories: Array<{ label: string; value: string; count?: number }>;
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
  amountRange: { min: number; max: number };
  onAmountRangeChange: (range: { min: number; max: number }) => void;
  onReset: () => void;
  activeFilterCount: number;
}

export function FilterSheet({
  visible,
  onClose,
  categories,
  selectedCategories,
  onCategoriesChange,
  amountRange,
  onAmountRangeChange,
  onReset,
  activeFilterCount,
}: FilterSheetProps) {
  if (!visible) return null;

  return (
    <YStack
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
      backgroundColor="rgba(0,0,0,0.5)"
      justifyContent="flex-end"
      zIndex={999}
    >
      <YStack
        backgroundColor="background"
        borderTopLeftRadius={24}
        borderTopRightRadius={24}
        padding={24}
        gap={16}
        maxHeight="80%"
      >
        <XStack justifyContent="space-between" alignItems="center">
          <Text fontSize={18} fontWeight="600" color="textPrimary">
            Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </Text>
          <Button variant="ghost" size="sm" onPress={onClose}>
            <X size={24} color="#666666" />
          </Button>
        </XStack>

        <YStack gap={16} overflow="scroll">
          <FilterChips
            title="Categories"
            options={categories}
            selected={selectedCategories}
            onSelect={onCategoriesChange}
          />

          <AmountRangeSlider
            min={amountRange.min}
            max={amountRange.max}
            onChange={onAmountRangeChange}
          />
        </YStack>

        <XStack gap={8} paddingTop={8}>
          <YStack flex={1}>
            <Button variant="outline" size="md" onPress={onReset}>
              Reset
            </Button>
          </YStack>
          <YStack flex={1}>
            <Button variant="filled" size="md" onPress={onClose}>
              Show Results
            </Button>
          </YStack>
        </XStack>
      </YStack>
    </YStack>
  );
}
