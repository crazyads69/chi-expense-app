import { useState } from 'react';
import { YStack, Text, XStack, ScrollView, Switch } from 'tamagui';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/button';
import { authService } from '@/services/auth';
import { api } from '@/services/api';
import { useAuthStore } from '@/stores/auth';
import { useThemeStore } from '@/stores/theme';
import { useUIStore } from '@/stores/ui';
import { Card } from '@/components/card';
import { OfflineBanner } from '@/components/offline-banner';
import { useNetworkStatus } from '@/hooks/use-network-status';
import { Download, Trash2, User, Moon, Wifi } from 'lucide-react-native';

export default function SettingsScreen() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { theme, followSystem, setTheme, setFollowSystem } = useThemeStore();
  const { showToast } = useUIStore();
  const { isOffline } = useNetworkStatus();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
