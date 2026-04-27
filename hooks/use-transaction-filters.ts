import { useState, useMemo, useCallback } from 'react';

export interface Transaction {
  id: string;
  amount: number;
  merchant: string;
  category: string;
  date: string;
  currency: string;
}

export interface AmountRange {
  min: number;
  max: number;
}

export interface UseTransactionFiltersReturn {
  searchText: string;
  setSearchText: (text: string) => void;
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  amountRange: AmountRange;
  setAmountRange: (range: AmountRange) => void;
  filteredTransactions: Transaction[];
  activeFilterCount: number;
  resetFilters: () => void;
  hasActiveFilters: boolean;
}

export function useTransactionFilters(
  transactions: Transaction[],
): UseTransactionFiltersReturn {
  const [searchText, setSearchText] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [amountRange, setAmountRange] = useState<AmountRange>({
    min: 0,
    max: 0,
  });

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      // Search text filter
      if (searchText) {
        const searchLower = searchText.toLowerCase();
        const matchesMerchant = transaction.merchant
          .toLowerCase()
          .includes(searchLower);
        const matchesCategory = transaction.category
          .toLowerCase()
          .includes(searchLower);
        if (!matchesMerchant && !matchesCategory) return false;
      }

      // Category filter
      if (
        selectedCategories.length > 0 &&
        !selectedCategories.includes(transaction.category)
      ) {
        return false;
      }

      // Amount range filter
      if (amountRange.min > 0 && transaction.amount < amountRange.min)
        return false;
      if (amountRange.max > 0 && transaction.amount > amountRange.max)
        return false;

      return true;
    });
  }, [transactions, searchText, selectedCategories, amountRange]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchText) count++;
    if (selectedCategories.length > 0) count++;
    if (amountRange.min > 0 || amountRange.max > 0) count++;
    return count;
  }, [searchText, selectedCategories, amountRange]);

  const resetFilters = useCallback(() => {
    setSearchText('');
    setSelectedCategories([]);
    setAmountRange({ min: 0, max: 0 });
  }, []);

  return {
    searchText,
    setSearchText,
    selectedCategories,
    setSelectedCategories,
    amountRange,
    setAmountRange,
    filteredTransactions,
    activeFilterCount,
    resetFilters,
    hasActiveFilters: activeFilterCount > 0,
  };
}
