import * as ImageManipulator from 'expo-image-manipulator';

export const MAX_IMAGE_WIDTH = 1200;
export const JPEG_QUALITY = 0.85;
export const MAX_FILE_SIZE_MB = 10;

export interface ImageValidationResult {
  valid: boolean;
  error?: string;
}

export function validateImage(uri: string, fileSize?: number): ImageValidationResult {
  const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.heic'];
  const lowerUri = uri.toLowerCase();
  const hasValidExtension = validExtensions.some((ext) => lowerUri.endsWith(ext));

  if (!hasValidExtension) {
    return { valid: false, error: 'Please select a valid image file (JPG, PNG, WEBP)' };
  }

  if (fileSize !== undefined) {
    const sizeInMB = fileSize / (1024 * 1024);
    if (sizeInMB > MAX_FILE_SIZE_MB) {
      return { valid: false, error: `Image must be smaller than ${MAX_FILE_SIZE_MB}MB` };
    }
  }

  return { valid: true };
}

export async function resizeImage(uri: string): Promise<string> {
  const manipulated = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: MAX_IMAGE_WIDTH } }],
    { compress: JPEG_QUALITY, format: ImageManipulator.SaveFormat.JPEG }
  );
  return manipulated.uri;
}

export async function formatImageForUpload(
  uri: string
): Promise<{ uri: string; type: string; name: string }> {
  const resizedUri = await resizeImage(uri);
  const extension = resizedUri.split('.').pop() || 'jpg';
  const mimeType = extension === 'png' ? 'image/png' : 'image/jpeg';
  const timestamp = Date.now();
  const filename = `receipt-${timestamp}.${extension}`;

  return {
    uri: resizedUri,
    type: mimeType,
    name: filename,
  };
}
