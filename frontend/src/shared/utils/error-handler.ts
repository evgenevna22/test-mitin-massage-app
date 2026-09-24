import type { BackendError, NotificationOptions } from '@/types';
import axios from 'axios';

type ErrorHandler = {
  error: unknown;
  needToast?: boolean;
  toastType?: 'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast';
};

export const handleError = (
  { error, needToast = true, toastType = 'error' }: ErrorHandler,
  notifications: { add: (props: NotificationOptions) => void }
) => {
  if (!needToast) {
    throw Error;
  }

  const isBackendError = axios.isAxiosError<BackendError>(error);

  notifications.add({
    severity: toastType,
    summary: isBackendError
      ? error.response?.data.error
      : 'Something went wrong. Refresh the page',
  });
  throw Error;
};
