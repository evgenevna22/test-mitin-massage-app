import type { BackendError } from '@/types';
import axios from 'axios';
import type { ToastServiceMethods } from 'primevue';

type ErrorHandler = {
  error: unknown;
  needToast?: boolean;
  toastType?: 'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast';
};

export const handleError = (
  { error, needToast = true, toastType = 'error' }: ErrorHandler,
  toast: ToastServiceMethods
) => {
  if (!needToast) {
    throw Error;
  }

  const isBackendError = axios.isAxiosError<BackendError>(error);

  toast.add({
    severity: toastType,
    summary: isBackendError
      ? error.response?.data.error
      : 'Something went wrong. Refresh the page',
  });
  throw Error;
};
