import { useState, useEffect } from 'react';
import { YStack, Text, XStack, ScrollView, Switch } from 'tamagui';
import { Alert, Platform, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/button';
import { authService } from '@/services/auth';
import { api } from '@/services/api';
import { useAuthStore } from '@/stores/auth';
import { useThemeStore } from '@/stores/theme';
import { useUIStore } from '@/stores/ui';
import { useNotificationStore } from '@/stores/notifications';
import { notificationService } from '@/services/notifications';
import { Card } from '@/components/card';
import { OfflineBanner } from '@/components/offline-banner';
import { useNetworkStatus } from '@/hooks/use-network-status';
import { useBiometric } from '@/hooks/use-biometric';
import { useSecurityStore } from '@/stores/security';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Download, Trash2, User, Moon, Bell, Clock, AlertTriangle, Shield } from 'lucide-react-native';

export default function SettingsScreen() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { theme, followSystem, setTheme, setFollowSystem } = useThemeStore();
  const { showToast } = useUIStore();
  const { isOffline } = useNetworkStatus();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { isAvailable, biometryType, isEnabled, enable, disable, isLoading: biometricLoading } = useBiometric();
  const { lockTimeout, setLockTimeout } = useSecurityStore();

  const { preferences, setPreferences } = useNotificationStore();
  const [isLoadingPrefs, setIsLoadingPrefs] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<{ granted: boolean; canAskAgain: boolean }>({
    granted: false,
    canAskAgain: true,
  });

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadPreferences = async () => {
      setIsLoadingPrefs(true);
      const status = await notificationService.getPermissionsStatus();
      setPermissionStatus(status);

      const prefs = await notificationService.fetchPreferences();
      if (prefs) {
        setPreferences(prefs);
      }
      setIsLoadingPrefs(false);
    };

    loadPreferences();
  }, [isAuthenticated]);

  const handleRequestPermission = async () => {
    if (!permissionStatus.canAskAgain && !permissionStatus.granted) {
      Linking.openSettings();
      return;
    }

    const { granted, canAskAgain } = await notificationService.requestPermissions();
    setPermissionStatus({ granted, canAskAgain });

    if (granted) {
      const token = await notificationService.registerPushTokenAsync();
      if (token) {
        await notificationService.registerTokenWithBackend(token, Platform.OS);
      }
    }
  };

  const handleUpdatePreference = async (update: Partial<typeof preferences>) => {
    setPreferences(update);
    const success = await notificationService.updatePreferences(update);
    if (!success) {
      showToast('Failed to save preferences', 'error');
    }
  };

  const onTimeChange = (event: any, selectedDate?: Date) => {
    setShowTimePicker(false);
    if (selectedDate) {
      const hours = selectedDate.getHours().toString().padStart(2, '0');
      const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
      handleUpdatePreference({ dailySummaryTime: `${hours}:${minutes}` });
    }
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await authService.signOut();
    setIsSigningOut(false);
    router.replace('/login');
  };

  const handleExport = async () => {
    if (isOffline) {
      showToast('Export requires internet connection', 'error');
      return;
    }
    
    setIsExporting(true);
    try {
      const response = await api.get('/account/export');
      showToast('Data exported successfully', 'success');
      // In a real app, you would share/save the file here
    } catch {
      showToast('Failed to export data', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete your account?',
      'All your data will be permanently removed. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (isOffline) {
              showToast('Delete requires internet connection', 'error');
              return;
            }
            
            setIsDeleting(true);
            try {
              await api.delete('/account');
              await authService.signOut();
              showToast('Account deleted', 'success');
              router.replace('/login');
            } catch {
              showToast('Failed to delete account', 'error');
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  return (
    <YStack flex={1} backgroundColor="$background">
      <OfflineBanner visible={isOffline} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <YStack padding={24} gap={24}>
          <Text fontSize={20} fontWeight="600" color="$textPrimary">
            Settings
          </Text>

          {isAuthenticated && user && (
            <Card>
              <YStack gap={8}>
                <XStack alignItems="center" gap={8}>
                  <User size={20} color="#2563EB" />
                  <Text fontSize={16} fontWeight="600" color="$textPrimary">
                    {user.name}
                  </Text>
                </XStack>
                <Text fontSize={14} color="$textSecondary">
                  {user.email}
                </Text>
              </YStack>
            </Card>
          )}

          <Card>
            <YStack gap={16}>
              <XStack alignItems="center" gap={8}>
                <Bell size={20} color="#2563EB" />
                <Text fontSize={16} fontWeight="600" color="$textPrimary">
                  Notifications
                </Text>
              </XStack>

              {!permissionStatus.granted && (
                <YStack gap={8}>
                  <Text fontSize={14} color="$textSecondary">
                    Enable push notifications to receive budget alerts and daily summaries.
                  </Text>
                  <Button
                    variant="outline"
                    size="sm"
                    onPress={handleRequestPermission}
                    disabled={isLoadingPrefs}
                  >
                    {permissionStatus.canAskAgain ? 'Enable Notifications' : 'Open Settings'}
                  </Button>
                </YStack>
              )}

              {permissionStatus.granted && (
                <YStack gap={16}>
                  <XStack justifyContent="space-between" alignItems="center">
                    <YStack>
                      <Text fontSize={14} color="$textPrimary">
                        Daily Summary
                      </Text>
                      <Text fontSize={12} color="$textMuted">
                        {preferences.dailySummaryTime}
                      </Text>
                    </YStack>
                    <Switch
                      checked={preferences.dailySummaryEnabled}
                      onCheckedChange={(checked) =>
                        handleUpdatePreference({ dailySummaryEnabled: checked })
                      }
                      backgroundColor={preferences.dailySummaryEnabled ? '$primary' : '$surface'}
                    />
                  </XStack>

                  {preferences.dailySummaryEnabled && (
                    <XStack justifyContent="space-between" alignItems="center">
                      <XStack alignItems="center" gap={8}>
                        <Clock size={16} color="$textSecondary" />
                        <Text fontSize={14} color="$textSecondary">
                          Time
                        </Text>
                      </XStack>
                      <Button variant="outline" size="sm" onPress={() => setShowTimePicker(true)}>
                        {preferences.dailySummaryTime}
                      </Button>
                    </XStack>
                  )}

                  {showTimePicker && (
                    <DateTimePicker
                      value={new Date(`2000-01-01T${preferences.dailySummaryTime}:00`)}
                      mode="time"
                      display="default"
                      onChange={onTimeChange}
                    />
                  )}

                  <XStack justifyContent="space-between" alignItems="center">
                    <YStack>
                      <Text fontSize={14} color="$textPrimary">
                        Budget Alerts
                      </Text>
                      <Text fontSize={12} color="$textMuted">
                        At {preferences.budgetThreshold}% of budget
                      </Text>
                    </YStack>
                    <Switch
                      checked={preferences.budgetAlertsEnabled}
                      onCheckedChange={(checked) =>
                        handleUpdatePreference({ budgetAlertsEnabled: checked })
                      }
                      backgroundColor={preferences.budgetAlertsEnabled ? '$primary' : '$surface'}
                    />
                  </XStack>

                  {preferences.budgetAlertsEnabled && (
                    <XStack justifyContent="space-between" alignItems="center">
                      <XStack alignItems="center" gap={8}>
                        <AlertTriangle size={16} color="$textSecondary" />
                        <Text fontSize={14} color="$textSecondary">
                          Threshold
                        </Text>
                      </XStack>
                      <XStack alignItems="center" gap={12}>
                        <Button
                          variant="outline"
                          size="sm"
                          onPress={() =>
                            handleUpdatePreference({
                              budgetThreshold: Math.max(1, preferences.budgetThreshold - 5),
                            })
                          }
                        >
                          -
                        </Button>
                        <Text fontSize={16} fontWeight="600">
                          {preferences.budgetThreshold}%
                        </Text>
                        <Button
                          variant="outline"
                          size="sm"
                          onPress={() =>
                            handleUpdatePreference({
                              budgetThreshold: Math.min(100, preferences.budgetThreshold + 5),
                            })
                          }
                        >
                          +
                        </Button>
                      </XStack>
                    </XStack>
                  )}
                </YStack>
              )}
            </YStack>
          </Card>

          <Card>
            <YStack gap={16}>
              <XStack alignItems="center" gap={8}>
                <Moon size={20} color="#2563EB" />
                <Text fontSize={16} fontWeight="600" color="$textPrimary">
                  Appearance
                </Text>
              </XStack>

              <XStack justifyContent="space-between" alignItems="center">
                <Text fontSize={14} color="$textSecondary">
                  Follow System Theme
                </Text>
                <Switch
                  checked={followSystem}
                  onCheckedChange={setFollowSystem}
                  backgroundColor={followSystem ? '$primary' : '$surface'}
                />
              </XStack>

              {!followSystem && (
                <XStack justifyContent="space-between" alignItems="center">
                  <Text fontSize={14} color="$textSecondary">
                    Dark Mode
                  </Text>
                  <Switch
                    checked={theme === 'dark'}
                    onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                    backgroundColor={theme === 'dark' ? '$primary' : '$surface'}
                  />
                </XStack>
              )}
            </YStack>
          </Card>

          {isAuthenticated && (
            <YStack gap={12}>
              <Card>
                <YStack gap={16}>
                  <XStack alignItems="center" gap={8}>
                    <Shield size={20} color="#2563EB" />
                    <Text fontSize={16} fontWeight="600" color="$textPrimary">
                      Security
                    </Text>
                  </XStack>

                  {isAvailable ? (
                    <>
                      <XStack justifyContent="space-between" alignItems="center">
                        <YStack>
                          <Text fontSize={14} color="$textSecondary">
                            Biometric Lock
                          </Text>
                          <Text fontSize={12} color="$textMuted">
                            {biometryType === 'facial' ? 'Face ID' : 'Fingerprint'}
                          </Text>
                        </YStack>
                        <Switch
                          checked={isEnabled}
                          onCheckedChange={async (checked) => {
                            if (checked) {
                              const success = await enable();
                              if (!success) {
                                showToast('Failed to enable biometric lock', 'error');
                              }
                            } else {
                              disable();
                            }
                          }}
                          disabled={biometricLoading}
                          backgroundColor={isEnabled ? '$primary' : '$surface'}
                        />
                      </XStack>

                      {isEnabled && (
                        <XStack justifyContent="space-between" alignItems="center">
                          <YStack>
                            <Text fontSize={14} color="$textSecondary">
                              Auto-lock after
                            </Text>
                          </YStack>
                          <XStack gap={8} alignItems="center">
                            {[1, 5, 15, 30].map((minutes) => (
                              <Button
                                key={minutes}
                                variant={lockTimeout === minutes ? 'filled' : 'outline'}
                                size="sm"
                                onPress={() => setLockTimeout(minutes)}
                              >
                                {minutes}m
                              </Button>
                            ))}
                          </XStack>
                        </XStack>
                      )}
                    </>
                  ) : (
                    <Text fontSize={14} color="$textMuted">
                      Biometric authentication is not available on this device.
                    </Text>
                  )}
                </YStack>
              </Card>

              <Card>
                <YStack gap={12}>
                  <Text fontSize={16} fontWeight="600" color="$textPrimary">
                    Data
                  </Text>
                  <Button
                    variant="outline"
                    size="md"
                    onPress={handleExport}
                    loading={isExporting}
                    disabled={isOffline}
                  >
                    <XStack alignItems="center" gap={8}>
                      <Download size={16} color="#2563EB" />
                      <Text>Export Data</Text>
                    </XStack>
                  </Button>
                </YStack>
              </Card>

              <Card>
                <YStack gap={12}>
                  <Text fontSize={16} fontWeight="600" color="$textPrimary">
                    Danger Zone
                  </Text>
                  <Button
                    variant="outline"
                    size="md"
                    onPress={handleDeleteAccount}
                    loading={isDeleting}
                    disabled={isOffline}
                  >
                    <XStack alignItems="center" gap={8}>
                      <Trash2 size={16} color="#EF4444" />
                      <Text color="#EF4444">Delete Account</Text>
                    </XStack>
                  </Button>
                </YStack>
              </Card>

              <Button
                variant="outline"
                size="md"
                onPress={handleSignOut}
                loading={isSigningOut}
              >
                Sign out
              </Button>
            </YStack>
          )}
        </YStack>
      </ScrollView>
    </YStack>
  );
}
