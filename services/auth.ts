import { authClient } from '@/lib/auth-client';
import { useAuthStore } from '@/stores/auth';
import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';

export interface AuthService {
  signInWithGitHub: () => Promise<{ error?: string }>;
  signInWithApple: () => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
}

class AuthServiceImpl implements AuthService {
  async signInWithGitHub(): Promise<{ error?: string }> {
    try {
      const result = await authClient.signIn.social({
        provider: 'github',
        callbackURL: 'chi-expense://',
      });

      if (result.error) {
        return { error: result.error.message || 'GitHub sign in failed' };
      }

      await this.handleAuthSuccess();
      return {};
    } catch (err) {
      return { error: 'GitHub sign in failed. Please try again.' };
    }
  }

  async signInWithApple(): Promise<{ error?: string }> {
    try {
      const result = await authClient.signIn.social({
        provider: 'apple',
        callbackURL: 'chi-expense://',
      });

      if (result.error) {
        return { error: result.error.message || 'Apple sign in failed' };
      }

      await this.handleAuthSuccess();
      return {};
    } catch (err) {
      return { error: 'Apple sign in failed. Please try again.' };
    }
  }

  async signOut(): Promise<void> {
    try {
      await authClient.signOut();
    } catch (err) {
      console.error('[Auth] Sign out error:', err);
    } finally {
      await useAuthStore.getState().logout();
    }
  }

  async refreshSession(): Promise<boolean> {
    try {
      const session = await authClient.getSession();
      if (session.data) {
        useAuthStore.getState().setUser({
          id: session.data.user.id,
          name: session.data.user.name || session.data.user.email,
          email: session.data.user.email,
          image: session.data.user.image || undefined,
        });
        useAuthStore.getState().setAuthenticated(true);
        return true;
      }
      return false;
    } catch (err) {
      console.error('[Auth] Session refresh error:', err);
      return false;
    }
  }

  private async handleAuthSuccess(): Promise<void> {
    const session = await authClient.getSession();
    if (session.data?.user) {
      useAuthStore.getState().setUser({
        id: session.data.user.id,
        name: session.data.user.name || session.data.user.email,
        email: session.data.user.email,
        image: session.data.user.image || undefined,
      });
      useAuthStore.getState().setAuthenticated(true);
    }
  }
}

export const authService = new AuthServiceImpl();
