import { YStack, Text, ScrollView } from 'tamagui';
import { Stack } from 'expo-router';
import { type ReactNode } from 'react';

interface LegalPageProps {
  title: string;
  lastUpdated: string;
  children: ReactNode;
}

export function LegalPage({ title, lastUpdated, children }: LegalPageProps) {
  return (
    <YStack flex={1} backgroundColor="$background">
      <Stack.Screen
        options={{
          title,
          headerShown: true,
          headerBackTitle: 'Settings',
        }}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <YStack padding={24} gap={16}>
          <Text fontSize={12} color="$textMuted">
            Last updated: {lastUpdated}
          </Text>
          <YStack gap={12}>
            {children}
          </YStack>
        </YStack>
      </ScrollView>
    </YStack>
  );
}
