import { useToastStore } from '@/stores/toastStore';

export const toast = {
  error: (message: string) => useToastStore.getState().addToast(message, 'error'),
  success: (message: string) => useToastStore.getState().addToast(message, 'success'),
  info: (message: string) => useToastStore.getState().addToast(message, 'info'),
};
