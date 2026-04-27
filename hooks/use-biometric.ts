import { useState, useEffect, useCallback } from 'react';
import { useSecurityStore } from '@/stores/security';
import { checkBiometricAvailability, authenticateBiometric } from '@/lib/biometric-auth';

export interface UseBiometricReturn {
  isAvailable: boolean;
  biometryType: string | null;
  isEnabled: boolean;
  isLoading: boolean;
  enable: () => Promise<boolean>;
  disable: () => void;
  authenticate: (promptMessage?: string) => Promise<boolean>;
  error: string | null;
}

export function useBiometric(): UseBiometricReturn {
  const [isAvailable, setIsAvailable] = useState(false);
  const [biometryType, setBiometryType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { isBiometricEnabled, setBiometricEnabled, updateLastAuthenticated } = useSecurityStore();

  useEffect(() => {
    checkAvailability();
  }, []);

  const checkAvailability = async () => {
    setIsLoading(true);
    const result = await checkBiometricAvailability();
    setIsAvailable(result.available);
    setBiometryType(result.biometryType);
    if (result.error) setError(result.error);
    setIsLoading(false);
  };

  const enable = useCallback(async (): Promise<boolean> => {
    setError(null);
    const success = await authenticateBiometric('Enable biometric lock');
    if (success) {
      setBiometricEnabled(true);
      updateLastAuthenticated();
    }
    return success;
  }, [setBiometricEnabled, updateLastAuthenticated]);

  const disable = useCallback(() => {
    setBiometricEnabled(false);
  }, [setBiometricEnabled]);

  const authenticate = useCallback(async (promptMessage?: string): Promise<boolean> => {
    setError(null);
    const success = await authenticateBiometric(promptMessage);
    if (success) {
      updateLastAuthenticated();
    }
    return success;
  }, [updateLastAuthenticated]);

  return {
    isAvailable,
    biometryType,
    isEnabled: isBiometricEnabled,
    isLoading,
    enable,
    disable,
    authenticate,
    error,
  };
}
