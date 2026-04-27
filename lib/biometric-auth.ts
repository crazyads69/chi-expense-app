import * as LocalAuthentication from 'expo-local-authentication';

export interface BiometricAvailability {
  available: boolean;
  biometryType: 'facial' | 'fingerprint' | null;
  error?: string;
}

export async function checkBiometricAvailability(): Promise<BiometricAvailability> {
  const compatible = await LocalAuthentication.hasHardwareAsync();
  if (!compatible) {
    return { available: false, biometryType: null, error: 'Device does not support biometric authentication' };
  }

  const enrolled = await LocalAuthentication.isEnrolledAsync();
  if (!enrolled) {
    return { available: false, biometryType: null, error: 'No biometric credentials enrolled' };
  }

  const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
  const hasFaceID = types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION);
  const hasFingerprint = types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT);

  return {
    available: true,
    biometryType: hasFaceID ? 'facial' : hasFingerprint ? 'fingerprint' : null,
  };
}

export async function authenticateBiometric(promptMessage = 'Authenticate'): Promise<boolean> {
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage,
    fallbackLabel: 'Use device PIN',
    disableDeviceFallback: false,
  });

  return result.success;
}
