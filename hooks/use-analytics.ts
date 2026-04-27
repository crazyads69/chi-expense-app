import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';

export interface TrendDataPoint {
  month: string;
  amount: number;
}

export interface CategoryDistribution {
  category: string;
  amount: number;
  percentage: number;
}

interface AnalyticsData {
  trend: TrendDataPoint[];
  distribution: CategoryDistribution[];
}

export function useAnalytics(selectedMonth: string) {
  const { data, isLoading, isRefetching, refetch } = useQuery<AnalyticsData>({
    queryKey: ['analytics', selectedMonth],
    queryFn: async () => {
      const [trendResponse, distributionResponse] = await Promise.all([
        api.get<Array<{ month: string; total: number }>>(
          `/insights/trends?endMonth=${selectedMonth}&months=6`
        ),
        api.get<{ categories: Array<{ category: string; amount: number; percentage: number }> }>(
          `/insights?month=${selectedMonth}`
        ),
      ]);

      return {
        trend: trendResponse.data.map((item) => ({
          month: new Date(item.month + '-01').toLocaleDateString('en-US', { month: 'short' }),
          amount: item.total,
        })),
        distribution: distributionResponse.data.categories || [],
      };
    },
  });

  return {
    trendData: data?.trend || [],
    distributionData: data?.distribution || [],
    isLoading,
    isRefetching,
    refetch,
  };
}
