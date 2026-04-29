import { YStack, Text } from 'tamagui';
import { ImagePlus, X } from 'lucide-react-native';
import { Image, Pressable } from 'react-native';
import { useTheme } from 'tamagui';

interface ImagePickerButtonProps {
  selectedUri?: string | null;
  onSelect: (uri: string) => void;
  onClear: () => void;
  label?: string;
}

export function ImagePickerButton({
  selectedUri,
  onSelect,
  onClear,
  label = 'Add receipt',
}: ImagePickerButtonProps) {
  const theme = useTheme();
  const hasImage = !!selectedUri;

  return (
    <Pressable onPress={() => !hasImage && onSelect('')}>
      <YStack
        width={120}
        height={120}
        backgroundColor="$surface"
        borderWidth={1}
        borderColor="$border"
        borderRadius={8}
        justifyContent="center"
        alignItems="center"
        overflow="hidden"
      >
        {hasImage ? (
          <>
            <Image
              source={{ uri: selectedUri }}
              style={{ width: 120, height: 120 }}
              resizeMode="cover"
            />
            <Pressable
              onPress={onClear}
              style={{
                position: 'absolute',
                top: 4,
                right: 4,
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: theme.textInverse?.val || '#FFFFFF',
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: theme.textPrimary?.val || '#000000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.2,
                shadowRadius: 2,
                elevation: 2,
              }}
            >
              <X size={16} stroke={theme.textPrimary?.val || '#111111'} />
            </Pressable>
          </>
        ) : (
          <YStack justifyContent="center" alignItems="center" gap={8}>
            <ImagePlus size={48} stroke={theme.textMuted?.val || '#999999'} />
            <Text fontSize={12} color="$textMuted" textAlign="center">
              {label}
            </Text>
          </YStack>
        )}
      </YStack>
    </Pressable>
  );
}
