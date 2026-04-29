import { useState } from 'react';
import { YStack, Text, XStack, ScrollView, useTheme } from 'tamagui';
import { Pressable, RefreshControl } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Card } from '@/components/card';
import { SkeletonCard } from '@/components/skeleton';
import { MonthPicker } from '@/components/month-picker';
import { OfflineBanner } from '@/components/offline-banner';
import { useNetworkStatus } from '@/hooks/use-network-status';
import { SpendingTrendChart } from '@/components/spending-trend-chart';
import { CategoryDistributionChart } from '@/components/category-distribution-chart';
import { AnalyticsCard } from '@/components/analytics-card';
import { useAnalytics } from '@/hooks/use-analytics';
import { useWidgetUpdater } from '@/hooks/use-widget-updater';
import { TrendingUp, TrendingDown, Wallet, Receipt, Calendar } from 'lucide-react-native';
import { AnimatedNumber } from '@/components/animated-number';

interface DashboardData {
  totalSpending: number;
  transactionCount: number;
  monthOverMonthChange: number;
  categoryBreakdown: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
}

export default function DashboardScreen() {
  const theme = useTheme();
  const { isOffline } = useNetworkStatus();
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  const { data, isLoading, isRefetching, refetch } = useQuery<DashboardData>({
    queryKey: ['dashboard', selectedMonth],
    queryFn: async () => {
      const response = await api.get<DashboardData>(`/insights?month=${selectedMonth}`);
      return response.data;
    },
  });

  const { trendData, distributionData, isLoading: analyticsLoading } = useAnalytics(selectedMonth);

  useWidgetUpdater(data, selectedMonth);

  return (
    <YStack flex={1} backgroundColor="$background">
      <OfflineBanner visible={isOffline} />
      
      <YStack padding={24} paddingBottom={8}>
        <XStack justifyContent="space-between" alignItems="center">
          <Text fontSize={20} fontWeight="600" color="$textPrimary">
            Dashboard
          </Text>
          <Pressable onPress={() => setShowMonthPicker(true)}>
            <XStack alignItems="center" gap={4}>
              <Calendar size={20} color={theme.primary.val} />
              <Text fontSize={14} color="$primary">
                {selectedMonth}
              </Text>
            </XStack>
          </Pressable>
        </XStack>
      </YStack>

      {isLoading ? (
        <YStack padding={24} gap={12}>
          <SkeletonCard />
          <SkeletonCard />
        </YStack>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
          }
        >
          <YStack padding={24} paddingTop={8} gap={32}>
            {/* Summary Row */}
            <XStack gap={12}>
              <Card>
                <YStack gap={8} flex={1}>
                  <XStack alignItems="center" gap={8}>
                    <Wallet size={20} color={theme.primary.val} />
                    <Text fontSize={14} color="$textSecondary">
                      Total Spending
                    </Text>
                  </XStack>
                  <AnimatedNumber
                    value={data?.totalSpending || 0}
                    formatter={(val) => val.toLocaleString('vi-VN')}
                  />
                  <XStack alignItems="center" gap={4}>
                    {(data?.monthOverMonthChange ?? 0) >= 0 ? (
                      <TrendingUp size={14} color={theme.error.val} />
                    ) : (
                      <TrendingDown size={14} color={theme.success.val} />
                    )}
                    <Text
                      fontSize={12}
                      color={(data?.monthOverMonthChange ?? 0) >= 0 ? '$error' : '$success'}
                    >
                      {Math.abs(data?.monthOverMonthChange ?? 0)}% vs last month
                    </Text>
                  </XStack>
                </YStack>
              </Card>

              <Card>
                <YStack gap={8} flex={1}>
                  <XStack alignItems="center" gap={8}>
                    <Receipt size={20} color={theme.primary.val} />
                    <Text fontSize={14} color="$textSecondary">
                      Transactions
                    </Text>
                  </XStack>
                  <Text fontSize={24} fontWeight="600" color="$textPrimary">
                    {data?.transactionCount || 0}
                  </Text>
                  <Text fontSize={12} color="$textMuted">
                    this month
                  </Text>
                </YStack>
              </Card>
            </XStack>

            {/* Category Breakdown */}
            <YStack gap={16}>
              <Text fontSize={18} fontWeight="600" color="$textPrimary">
                By Category
              </Text>

              {data?.categoryBreakdown?.length === 0 ? (
                <Card>
                  <YStack alignItems="center" paddingVertical={24} gap={8}>
                    <Text fontSize={14} color="$textSecondary" textAlign="center">
                      Your spending story is just beginning
                    </Text>
                    <Text fontSize={12} color="$textMuted" textAlign="center">
                      Add expenses to see your category breakdown
                    </Text>
                  </YStack>
                </Card>
              ) : (
                data?.categoryBreakdown?.map((item) => (
                  <Card key={item.category} variant="compact">
                    <YStack gap={8}>
                      <XStack justifyContent="space-between" alignItems="center">
                        <Text fontSize={16} fontWeight="600" color="$textPrimary">
                          {item.category}
                        </Text>
                        <Text fontSize={14} color="$textSecondary">
                          {item.amount.toLocaleString('vi-VN')} VND
                        </Text>
                      </XStack>
                      <YStack height={8} backgroundColor="$surface" borderRadius={4} overflow="hidden">
                        <YStack
                          height={8}
                          backgroundColor="$primary"
                          width={`${item.percentage}%`}
                          borderRadius={4}
                        />
                      </YStack>
                      <Text fontSize={12} color="$textMuted">
                        {item.percentage}% of total
                      </Text>
                    </YStack>
                  </Card>
                ))
              )}
            </YStack>

            {/* Spending Trend Chart */}
            <YStack gap={16}>
              <Text fontSize={18} fontWeight="600" color="$textPrimary">
                Spending Trend
              </Text>
              {analyticsLoading ? (
                <AnalyticsCard>
                  <SkeletonCard />
                </AnalyticsCard>
              ) : (
                <AnalyticsCard empty={trendData.length === 0}>
                  <SpendingTrendChart data={trendData} currency="VND" />
                </AnalyticsCard>
              )}
            </YStack>

            {/* Category Distribution Chart */}
            <YStack gap={16}>
              <Text fontSize={18} fontWeight="600" color="$textPrimary">
                Category Distribution
              </Text>
              {analyticsLoading ? (
                <AnalyticsCard>
                  <SkeletonCard />
                </AnalyticsCard>
              ) : (
                <AnalyticsCard empty={distributionData.length === 0}>
                  <CategoryDistributionChart data={distributionData} currency="VND" />
                </AnalyticsCard>
              )}
            </YStack>
          </YStack>
        </ScrollView>
      )}

      {/* Month Picker Modal */}
      {showMonthPicker && (
        <Pressable
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 24,
          }}
          onPress={() => setShowMonthPicker(false)}
        >
          <Pressable onPress={() => {}}>
            <YStack
              backgroundColor="$surface"
              borderRadius={16}
              width="100%"
              maxWidth={400}
            >
              <MonthPicker
                selectedMonth={selectedMonth}
                onSelect={(month) => {
                  setSelectedMonth(month);
                  setShowMonthPicker(false);
                }}
              />
            </YStack>
          </Pressable>
        </Pressable>
      )}
    </YStack>
  );
}
