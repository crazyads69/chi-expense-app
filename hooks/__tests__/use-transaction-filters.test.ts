import { renderHook, act } from '@testing-library/react-native';
import { useTransactionFilters } from '../use-transaction-filters';

const mockTransactions = [
  { id: '1', amount: 45000, merchant: 'Starbucks', category: 'Food', date: '2025-04-01', currency: 'VND' },
  { id: '2', amount: 120000, merchant: 'Grab', category: 'Transport', date: '2025-04-02', currency: 'VND' },
  { id: '3', amount: 300000, merchant: 'Circle K', category: 'Food', date: '2025-04-03', currency: 'VND' },
];

describe('useTransactionFilters', () => {
  it('returns all transactions when no filters applied', () => {
    const { result } = renderHook(() => useTransactionFilters(mockTransactions));
    expect(result.current.filteredTransactions).toHaveLength(3);
    expect(result.current.hasActiveFilters).toBe(false);
  });

  it('filters by search text (merchant)', () => {
    const { result } = renderHook(() => useTransactionFilters(mockTransactions));
    act(() => result.current.setSearchText('Star'));
    expect(result.current.filteredTransactions).toHaveLength(1);
    expect(result.current.filteredTransactions[0].merchant).toBe('Starbucks');
  });

  it('filters by search text (category)', () => {
    const { result } = renderHook(() => useTransactionFilters(mockTransactions));
    act(() => result.current.setSearchText('Transport'));
    expect(result.current.filteredTransactions).toHaveLength(1);
    expect(result.current.filteredTransactions[0].category).toBe('Transport');
  });

  it('filters by selected categories', () => {
    const { result } = renderHook(() => useTransactionFilters(mockTransactions));
    act(() => result.current.setSelectedCategories(['Food']));
    expect(result.current.filteredTransactions).toHaveLength(2);
  });

  it('filters by amount range', () => {
    const { result } = renderHook(() => useTransactionFilters(mockTransactions));
    act(() => result.current.setAmountRange({ min: 50000, max: 200000 }));
    expect(result.current.filteredTransactions).toHaveLength(1);
    expect(result.current.filteredTransactions[0].merchant).toBe('Grab');
  });

  it('counts active filters correctly', () => {
    const { result } = renderHook(() => useTransactionFilters(mockTransactions));
    expect(result.current.activeFilterCount).toBe(0);
    act(() => result.current.setSearchText('test'));
    expect(result.current.activeFilterCount).toBe(1);
  });

  it('resets all filters', () => {
    const { result } = renderHook(() => useTransactionFilters(mockTransactions));
    act(() => {
      result.current.setSearchText('test');
      result.current.setSelectedCategories(['Food']);
    });
    expect(result.current.hasActiveFilters).toBe(true);
    act(() => result.current.resetFilters());
    expect(result.current.hasActiveFilters).toBe(false);
    expect(result.current.filteredTransactions).toHaveLength(3);
  });
});
