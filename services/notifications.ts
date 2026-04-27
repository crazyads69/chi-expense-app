import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { api } from './api';

export interface NotificationPermissions {
  granted: boolean;
  canAskAgain: boolean;
}

class NotificationService {
  async requestPermissions(): Promise<NotificationPermissions> {
    if (!Device.isDevice) {
      return { granted: false, canAskAgain: false };
    }

    const { status, canAskAgain } = await Notifications.requestPermissionsAsync({
      ios: { allowAlert: true, allowBadge: true, allowSound: true },
    });

    return { granted: status === 'granted', canAskAgain: !!canAskAgain };
  }

  async getPermissionsStatus(): Promise<NotificationPermissions> {
    if (!Device.isDevice) {
      return { granted: false, canAskAgain: false };
    }

    const { status, canAskAgain } = await Notifications.getPermissionsAsync();
    return { granted: status === 'granted', canAskAgain: !!canAskAgain };
  }

  async registerPushTokenAsync(): Promise<string | null> {
    if (!Device.isDevice) {
      console.log('Push notifications require a physical device');
      return null;
    }

    // Android: create notification channel before requesting token
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    const { granted } = await this.getPermissionsStatus();
    if (!granted) {
      return null;
    }

    try {
      const projectId =
        Constants.expoConfig?.extra?.eas?.projectId ??
        Constants.easConfig?.projectId;

      if (!projectId) {
        console.warn('EAS Project ID not found');
        return null;
      }

      const { data: token } = await Notifications.getExpoPushTokenAsync({
        projectId,
      });

      return token;
    } catch (error) {
      console.error('Failed to get push token:', error);
      return null;
    }
  }

  async registerTokenWithBackend(token: string, platform: string): Promise<void> {
    try {
      await api.post('/notifications/token', { token, platform });
    } catch (error) {
      console.error('Failed to register push token with backend:', error);
    }
  }

  async unregisterTokenWithBackend(token: string): Promise<void> {
    try {
      // api.delete does not accept a body; pass token as query param
      await api.delete(`/notifications/token?token=${encodeURIComponent(token)}`);
    } catch (error) {
      console.error('Failed to unregister push token:', error);
    }
  }

  addPushTokenListener(callback: (token: string) => void): Notifications.EventSubscription {
    return Notifications.addPushTokenListener((newToken) => {
      callback(newToken.data);
    });
  }

  removePushTokenListener(subscription: Notifications.EventSubscription): void {
    subscription.remove();
  }

  setNotificationHandler(): void {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });
  }
}

export const notificationService = new NotificationService();
