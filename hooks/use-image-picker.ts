import { useState, useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
import { resizeImage, validateImage } from '../lib/image-utils';

export interface UseImagePickerReturn {
  selectedImage: ImagePicker.ImagePickerAsset | null;
  pickFromGallery: () => Promise<void>;
  pickFromCamera: () => Promise<void>;
  clearImage: () => void;
  isLoading: boolean;
  error: string | null;
}

const IMAGE_PICKER_OPTIONS: ImagePicker.ImagePickerOptions = {
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsEditing: true,
  aspect: [3, 4],
  quality: 1,
};

export function useImagePicker(): UseImagePickerReturn {
  const [selectedImage, setSelectedImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageResult = useCallback(async (result: ImagePicker.ImagePickerResult) => {
    setIsLoading(false);

    if (result.canceled) {
      return;
    }

    const asset = result.assets[0];
    if (!asset) {
      setError('No image selected');
      return;
    }

    const validation = validateImage(asset.uri, asset.fileSize ?? undefined);
    if (!validation.valid) {
      setError(validation.error || 'Invalid image');
      return;
    }

    try {
      const resizedUri = await resizeImage(asset.uri);
      setSelectedImage({
        ...asset,
        uri: resizedUri,
      });
      setError(null);
    } catch {
      setError('Failed to process image');
    }
  }, []);

  const pickFromGallery = useCallback(async () => {
    setError(null);
    setIsLoading(true);

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      setIsLoading(false);
      Alert.alert(
        'Photo Access Needed',
        'Chi Expense needs access to your photos to select receipt images.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => {} },
        ]
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync(IMAGE_PICKER_OPTIONS);
    await handleImageResult(result);
  }, [handleImageResult]);

  const pickFromCamera = useCallback(async () => {
    setError(null);
    setIsLoading(true);

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      setIsLoading(false);
      Alert.alert(
        'Camera Access Needed',
        'Chi Expense needs camera access to capture receipt photos.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => {} },
        ]
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync(IMAGE_PICKER_OPTIONS);
    await handleImageResult(result);
  }, [handleImageResult]);

  const clearImage = useCallback(() => {
    setSelectedImage(null);
    setError(null);
  }, []);

  return {
    selectedImage,
    pickFromGallery,
    pickFromCamera,
    clearImage,
    isLoading,
    error,
  };
}
