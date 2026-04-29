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
  label = 'Tap to add receipt',
}: ImagePickerButtonProps) {
  const theme = useTheme();
  const hasImage = !!selectedUri;

  return (
    <Pressable onPress={() => !hasImage && onSelect('')}>
      <YStack
        width={120}
        height={120}
        backgroundColor={hasImage ? '$surface' : 'transparent'}
        borderWidth={hasImage ? 1 : 2}
        borderColor={hasImage ? '$border' : '$primary'}
        borderRadius={12}
        justifyContent="center"
        alignItems="center"
        overflow="hidden"
        style={!hasImage ? { borderStyle: 'dashed' } : undefined}
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
          <YStack justifyContent="center" alignItems="center" gap={8} padding={8}>
            <ImagePlus size={32} stroke={theme.primary?.val || '#0D9488'} />
            <Text fontSize={11} color="$primary" textAlign="center" fontWeight="500">
              {label}
            </Text>
          </YStack>
        )}
      </YStack>
    </Pressable>
  );
}
