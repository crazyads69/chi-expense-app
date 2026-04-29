import { useState, useEffect } from 'react';
import { YStack, Text, XStack, ScrollView } from 'tamagui';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '@/services/api';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Card } from '@/components/card';
import { useUIStore } from '@/stores/ui';
import { ImagePickerButton } from '@/components/image-picker-button';
import { useImagePicker } from '@/hooks/use-image-picker';
import { formatImageForUpload } from '@/lib/image-utils';

interface ParsedExpense {
  amount: number;
  merchant: string;
  category: string;
  date: string;
  currency?: string;
}

export default function AddScreen() {
  const router = useRouter();
  const { showToast } = useUIStore();
  const [inputText, setInputText] = useState('');
  const [inputMode, setInputMode] = useState<'text' | 'image' | 'sms'>('text');
  const [isParsing, setIsParsing] = useState(false);
  const [parsedResult, setParsedResult] = useState<ParsedExpense | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [parsingMessage, setParsingMessage] = useState('Thinking...');

  const parsingMessages = [
    'Reading your receipt...',
    'Finding the total...',
    'Identifying the merchant...',
    'Almost there...',
  ];

  useEffect(() => {
    if (!isParsing) return;
    let index = 0;
    setParsingMessage(parsingMessages[0]);
    const interval = setInterval(() => {
      index = (index + 1) % parsingMessages.length;
      setParsingMessage(parsingMessages[index]);
    }, 1500);
    return () => clearInterval(interval);
  }, [isParsing]);

  const {
    selectedImage,
    pickFromGallery,
    pickFromCamera,
    clearImage,
    isLoading: isImageLoading,
    error: imageError,
  } = useImagePicker();

  const handleParseText = async () => {
    if (!inputText.trim()) return;

    setIsParsing(true);
    setParseError(null);

    try {
      const response = await api.post<{ parsed: ParsedExpense }>('/input/text', {
        text: inputText,
      });

      setParsedResult(response.data.parsed);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to parse expense';
      setParseError(message);
      showToast('Failed to parse expense', 'error');
    } finally {
      setIsParsing(false);
    }
  };

  const handleParseImage = async () => {
    if (!selectedImage?.uri) return;

    setIsParsing(true);
    setParseError(null);

    try {
      const formatted = await formatImageForUpload(selectedImage.uri);

      const formData = new FormData();
      formData.append('image', {
        uri: formatted.uri,
        type: formatted.type,
        name: formatted.name,
      } as unknown as Blob);

      const response = await api.postMultipart<{ parsed: ParsedExpense }>('/input/image', formData);
      setParsedResult(response.data.parsed);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to parse receipt';
      setParseError(message);
      showToast('Failed to parse receipt', 'error');
    } finally {
      setIsParsing(false);
    }
  };

  const handleSave = async () => {
    if (!parsedResult || isSaving) return;

    setIsSaving(true);
    try {
      await api.post('/transactions', {
        amount: parsedResult.amount,
        merchant: parsedResult.merchant,
        category: parsedResult.category,
        date: parsedResult.date,
        currency: parsedResult.currency || 'VND',
      });

      showToast('Expense saved successfully', 'success');
      setParsedResult(null);
      setInputText('');
      clearImage();
      router.push('/(tabs)/transactions');
    } catch (err: unknown) {
      console.error('[Add] Save expense failed:', err);
      showToast('Failed to save expense', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRetry = () => {
    setParsedResult(null);
    setParseError(null);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <YStack flex={1} backgroundColor="$background" padding={24} gap={16}>
        <Text fontSize={20} fontWeight="600" color="$textPrimary">
          What did you buy?
        </Text>

        {!parsedResult ? (
          <ScrollView showsVerticalScrollIndicator={false}>
            <YStack gap={16} paddingBottom={100}>
              {/* Input Mode Selector */}
              <XStack gap={8}>
                {(['text', 'image', 'sms'] as const).map((mode) => (
                  <Button
                    key={mode}
                    variant={inputMode === mode ? 'filled' : 'outline'}
                    size="sm"
                    onPress={() => {
                      setInputMode(mode);
                      setParseError(null);
                    }}
                  >
                    {mode === 'text' ? 'Text' : mode === 'image' ? 'Photo' : 'SMS'}
                  </Button>
                ))}
              </XStack>

              {/* Text Input */}
              {inputMode === 'text' && (
                <YStack gap={12}>
                  <Input
                    label="What did you spend on?"
                    placeholder="E.g., Coffee at Starbucks 45k"
                    value={inputText}
                    onChangeText={setInputText}
                    multiline
                    numberOfLines={4}
                  />
                  <Button
                    variant="filled"
                    size="md"
                    onPress={handleParseText}
                    loading={isParsing}
                    disabled={!inputText.trim() || isParsing}
                  >
                    Add it
                  </Button>
                </YStack>
              )}

              {/* Image Input */}
              {inputMode === 'image' && (
                <YStack gap={12}>
                  <Text fontSize={14} color="$textSecondary">
                    Take a photo or select a receipt image
                  </Text>
                  <XStack gap={12}>
                    <ImagePickerButton
                      selectedUri={selectedImage?.uri}
                      onSelect={() => pickFromGallery()}
                      onClear={clearImage}
                    />
                    <YStack gap={8} justifyContent="center">
                      <Button
                        variant="outline"
                        size="sm"
                        onPress={() => pickFromGallery()}
                      >
                        Gallery
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onPress={() => pickFromCamera()}
                      >
                        Camera
                      </Button>
                    </YStack>
                  </XStack>
                  <Button
                    variant="filled"
                    size="md"
                    onPress={handleParseImage}
                    loading={isParsing || isImageLoading}
                    disabled={!selectedImage || isParsing || isImageLoading}
                  >
                    Scan receipt
                  </Button>
                </YStack>
              )}

              {/* SMS Input */}
              {inputMode === 'sms' && (
                <YStack gap={12}>
                  <Input
                    label="Paste your bank message"
                    placeholder="Paste your banking SMS here..."
                    value={inputText}
                    onChangeText={setInputText}
                    multiline
                    numberOfLines={6}
                  />
                  <Button
                    variant="filled"
                    size="md"
                    onPress={handleParseText}
                    loading={isParsing}
                    disabled={!inputText.trim() || isParsing}
                  >
                    Read SMS
                  </Button>
                </YStack>
              )}

              {isParsing && (
                <Text fontSize={14} color="$textMuted" textAlign="center">
                  {parsingMessage}
                </Text>
              )}

              {(parseError || imageError) && (
                <Text fontSize={14} color="$error">
                  {parseError || imageError}
                </Text>
              )}
            </YStack>
          </ScrollView>
        ) : (
          /* Parsed Result Preview */
          <ScrollView showsVerticalScrollIndicator={false}>
            <YStack gap={16} paddingBottom={100}>
              <Text fontSize={18} fontWeight="600" color="$textPrimary">
                Looks good?
              </Text>

              <Card>
                <YStack gap={12}>
                  <YStack gap={4}>
                    <Text fontSize={14} color="$textSecondary">
                      Amount
                    </Text>
                    <Text fontSize={24} fontWeight="600" color="$textPrimary">
                      {parsedResult.amount.toLocaleString('vi-VN')} {parsedResult.currency || 'VND'}
                    </Text>
                  </YStack>

                  <YStack gap={4}>
                    <Text fontSize={14} color="$textSecondary">
                      Merchant
                    </Text>
                    <Text fontSize={16} color="$textPrimary">
                      {parsedResult.merchant}
                    </Text>
                  </YStack>

                  <YStack gap={4}>
                    <Text fontSize={14} color="$textSecondary">
                      Category
                    </Text>
                    <Text fontSize={16} color="$textPrimary">
                      {parsedResult.category}
                    </Text>
                  </YStack>

                  <YStack gap={4}>
                    <Text fontSize={14} color="$textSecondary">
                      Date
                    </Text>
                    <Text fontSize={16} color="$textPrimary">
                      {new Date(parsedResult.date).toLocaleDateString('vi-VN')}
                    </Text>
                  </YStack>
                </YStack>
              </Card>

              <YStack gap={8}>
                <Button
                  variant="filled"
                  size="md"
                  onPress={handleSave}
                  loading={isSaving}
                  disabled={isSaving}
                >
                  Save it
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  onPress={handleRetry}
                >
                  Start over
                </Button>
              </YStack>
            </YStack>
          </ScrollView>
        )}
      </YStack>
    </KeyboardAvoidingView>
  );
}
