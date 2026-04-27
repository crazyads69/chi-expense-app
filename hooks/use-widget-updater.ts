import { useEffect } from 'react';
import { updateWidgetData, reloadAllWidgets } from '@/lib/widget-bridge';

interface DashboardData {
  totalSpending: number;
  transactionCount: number;
}

/**
 * Automatically updates home screen widgets whenever dashboard data changes.
 * Pass the dashboard data directly from the component that already fetched it.
 */
export function useWidgetUpdater(data: DashboardData | undefined, selectedMonth: string) {
  useEffect(() => {
    if (!data) return;

    const monthLabel = new Date(selectedMonth + '-01').toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });

    updateWidgetData({
      monthLabel,
      total: data.totalSpending,
      currency: 'VND',
      count: data.transactionCount,
    })
      .then(() => reloadAllWidgets())
      .catch(console.error);
  }, [data, selectedMonth]);
}
