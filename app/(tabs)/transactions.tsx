import { useState, useCallback } from 'react';
import { YStack, Text, XStack, ScrollView } from 'tamagui';
import { api } from '@/services/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { SkeletonCard } from '@/components/skeleton';
import { TransactionForm } from '@/components/transaction-form';
import { MonthPicker } from '@/components/month-picker';
import { SearchBar } from '@/components/search-bar';
import { FilterSheet } from '@/components/filter-sheet';
import { OfflineBanner } from '@/components/offline-banner';
import { useUIStore } from '@/stores/ui';
import { useNetworkStatus } from '@/hooks/use-network-status';
import { useTransactionFilters } from '@/hooks/use-transaction-filters';
import { RefreshControl, Alert } from 'react-native';
import { Trash2, Pencil, Calendar, SlidersHorizontal } from 'lucide-react-native';

interface Transaction {
  id: string;
  amount: number;
  merchant: string;
  category: string;
  date: string;
  currency: string;
  description?: string;
}

interface TransactionsResponse {
  transactions: Transaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function TransactionsScreen() {
  const queryClient = useQueryClient();
  const { showToast } = useUIStore();
  const { isOffline } = useNetworkStatus();
  const [page, setPage] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const { data, isLoading, isRefetching, refetch } = useQuery<TransactionsResponse>({
    queryKey: ['transactions', selectedMonth, page],
    queryFn: async () => {
      const response = await api.get<TransactionsResponse>(`/transactions?month=${selectedMonth}&page=${page}&limit=20`);
      return response.data;
    },
  });

  // Get categories for filter chips
  interface CategoriesResponse {
    categories: Array<{ id: string; name: string }>;
  }

  const { data: categoriesData } = useQuery<CategoriesResponse>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get<CategoriesResponse>('/categories');
      return response.data;
    },
  });

  const {
    searchText,
    setSearchText,
    selectedCategories,
    setSelectedCategories,
    amountRange,
    setAmountRange,
    filteredTransactions,
    activeFilterCount,
    resetFilters,
    hasActiveFilters,
  } = useTransactionFilters(data?.transactions || []);

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/transactions/${id}`);
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['transactions'] });
      const previousData = queryClient.getQueryData<TransactionsResponse>(['transactions', selectedMonth, page]);
      
      if (previousData) {
        queryClient.setQueryData(['transactions', selectedMonth, page], {
          ...previousData,
          transactions: previousData.transactions.filter((t) => t.id !== id),
        });
      }
      
      return { previousData };
    },
    onError: (err, id, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['transactions', selectedMonth, page], context.previousData);
      }
      showToast('Failed to delete transaction', 'error');
    },
    onSuccess: () => {
      showToast('Transaction deleted', 'success');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });

  const editMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      await api.patch(`/transactions/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      showToast('Transaction updated', 'success');
      setEditingTransaction(null);
    },
    onError: () => {
      showToast('Failed to update transaction', 'error');
    },
  });

  const handleDelete = useCallback((id: string) => {
    Alert.alert(
      'Delete this expense?',
      'This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deleteMutation.mutate(id)
        },
      ]
    );
  }, [deleteMutation]);

  const handleEdit = useCallback((transaction: Transaction) => {
    setEditingTransaction(transaction);
  }, []);

  const handleUpdate = (formData: any) => {
    if (!editingTransaction) return;
    editMutation.mutate({
      id: editingTransaction.id,
      data: {
        amount: parseFloat(formData.amount),
        merchant: formData.merchant,
        category: formData.category,
        date: formData.date,
      },
    });
  };

  const transactions = data?.transactions || [];
  const pagination = data?.pagination;

  const categoryOptions = (categoriesData?.categories || []).map((cat) => ({
    label: cat.name,
    value: cat.name,
  }));

  const displayTransactions = hasActiveFilters ? filteredTransactions : transactions;
  const totalCount = transactions.length;

  return (
    <YStack flex={1} backgroundColor="$background">
      <OfflineBanner visible={isOffline} />
      
      <YStack padding={24} paddingBottom={8}>
        <XStack justifyContent="space-between" alignItems="center">
          <Text fontSize={20} fontWeight="600" color="$textPrimary">
            Transactions
          </Text>
          <Button
            variant="outline"
            size="sm"
            onPress={() => setShowMonthPicker(true)}
          >
            <Calendar size={16} color="#2563EB" />
          </Button>
        </XStack>
        <Text fontSize={14} color="$textSecondary" marginTop={4}>
          {selectedMonth}
        </Text>
      </YStack>

      {/* Search and Filter */}
      <YStack paddingHorizontal={24} gap={12} paddingBottom={8}>
        <SearchBar
          value={searchText}
          onChange={setSearchText}
          placeholder="Search by merchant or category..."
        />
        <XStack justifyContent="space-between" alignItems="center">
          <Button
            variant="outline"
            size="sm"
            onPress={() => setShowFilterSheet(true)}
          >
            <XStack alignItems="center" gap={4}>
              <SlidersHorizontal size={16} color="#2563EB" />
              <Text>Filters</Text>
              {activeFilterCount > 0 && (
                <YStack
                  backgroundColor="primary"
                  borderRadius={10}
                  width={20}
                  height={20}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Text fontSize={12} color="white" fontWeight="600">
                    {activeFilterCount}
                  </Text>
                </YStack>
              )}
            </XStack>
          </Button>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onPress={resetFilters}>
              <Text fontSize={14} color="primary">Clear</Text>
            </Button>
          )}
        </XStack>
        {hasActiveFilters && (
          <Text fontSize={14} color="$textSecondary">
            Showing {displayTransactions.length} of {totalCount} transactions
          </Text>
        )}
      </YStack>

      {isLoading ? (
        <YStack padding={24} gap={12}>
          <SkeletonCard />
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
          <YStack padding={24} paddingTop={8} gap={12}>
            {displayTransactions.length === 0 ? (
              <YStack alignItems="center" gap={16} paddingVertical={48}>
                <Text fontSize={16} fontWeight="600" color="$textPrimary" textAlign="center">
                  {hasActiveFilters ? 'No results found' : 'No expenses yet'}
                </Text>
                <Text fontSize={14} color="$textSecondary" textAlign="center">
                  {hasActiveFilters 
                    ? 'Try adjusting your filters' 
                    : 'Tap + to add your first expense'}
                </Text>
              </YStack>
            ) : (
              <>
                {displayTransactions.map((transaction) => (
                  <Card key={transaction.id} variant="interactive">
                    <XStack justifyContent="space-between" alignItems="center">
                      <YStack flex={1} gap={4}>
                        <Text fontSize={16} fontWeight="600" color="$textPrimary">
                          {transaction.merchant}
                        </Text>
                        <XStack gap={8}>
                          <Text fontSize={14} color="$textSecondary">
                            {transaction.category}
                          </Text>
                          <Text fontSize={14} color="$textMuted">
                            {new Date(transaction.date).toLocaleDateString('vi-VN')}
                          </Text>
                        </XStack>
                      </YStack>
                      <YStack alignItems="flex-end" gap={4}>
                        <Text fontSize={16} fontWeight="600" color="$textPrimary">
                          {transaction.amount.toLocaleString('vi-VN')} {transaction.currency}
                        </Text>
                        <XStack gap={8}>
                          <YStack
                            onPress={() => handleEdit(transaction)}
                            padding={8}
                            pressStyle={{ opacity: 0.7 }}
                          >
                            <Pencil size={16} color="#666666" />
                          </YStack>
                          <YStack
                            onPress={() => handleDelete(transaction.id)}
                            padding={8}
                            pressStyle={{ opacity: 0.7 }}
                          >
                            <Trash2 size={16} color="#EF4444" />
                          </YStack>
                        </XStack>
                      </YStack>
                    </XStack>
                  </Card>
                ))}

                {pagination && pagination.totalPages > 1 && (
                  <XStack justifyContent="center" gap={12} paddingVertical={16}>
                    <Button
                      variant="outline"
                      size="sm"
                      onPress={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <Text fontSize={14} color="$textSecondary" alignSelf="center">
                      Page {page} of {pagination.totalPages}
                    </Text>
                    <Button
                      variant="outline"
                      size="sm"
                      onPress={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                      disabled={page === pagination.totalPages}
                    >
                      Next
                    </Button>
                  </XStack>
                )}
              </>
            )}
          </YStack>
        </ScrollView>
      )}

      {/* Filter Sheet */}
      <FilterSheet
        visible={showFilterSheet}
        onClose={() => setShowFilterSheet(false)}
        categories={categoryOptions}
        selectedCategories={selectedCategories}
        onCategoriesChange={setSelectedCategories}
        amountRange={amountRange}
        onAmountRangeChange={setAmountRange}
        onReset={resetFilters}
        activeFilterCount={activeFilterCount}
      />

      {/* Month Picker Modal */}
      {showMonthPicker && (
        <YStack
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          backgroundColor="rgba(0,0,0,0.5)"
          justifyContent="center"
          alignItems="center"
          padding={24}
        >
          <YStack
            backgroundColor="surface"
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
            <YStack padding={16} paddingTop={0}>
              <Button
                variant="outline"
                size="md"
                onPress={() => setShowMonthPicker(false)}
              >
                Cancel
              </Button>
            </YStack>
          </YStack>
        </YStack>
      )}

      {/* Edit Transaction Modal */}
      {editingTransaction && (
        <YStack
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          backgroundColor="rgba(0,0,0,0.5)"
          justifyContent="center"
          alignItems="center"
          padding={24}
        >
          <YStack
            backgroundColor="surface"
            borderRadius={16}
            padding={24}
            width="100%"
            maxWidth={400}
            gap={16}
          >
            <Text fontSize={18} fontWeight="600" color="textPrimary">
              Edit Transaction
            </Text>
            <TransactionForm
              initialData={{
                amount: editingTransaction.amount.toString(),
                merchant: editingTransaction.merchant,
                category: editingTransaction.category,
                date: editingTransaction.date,
              }}
              onSubmit={handleUpdate}
              onCancel={() => setEditingTransaction(null)}
              isLoading={editMutation.isPending}
            />
          </YStack>
        </YStack>
      )}
    </YStack>
  );
}
