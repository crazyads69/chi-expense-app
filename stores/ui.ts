import { create } from 'zustand';

interface UIState {
  isLoading: boolean;
  modalVisible: boolean;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  setLoading: (loading: boolean) => void;
  showModal: () => void;
  hideModal: () => void;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isLoading: false,
  modalVisible: false,
  toast: null,
  setLoading: (isLoading) => set({ isLoading }),
  showModal: () => set({ modalVisible: true }),
  hideModal: () => set({ modalVisible: false }),
  showToast: (message, type) => set({ toast: { message, type } }),
  hideToast: () => set({ toast: null }),
}));
