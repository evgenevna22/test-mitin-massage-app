import { useToast } from 'primevue/usetoast';
import type { NotificationOptions } from '@/types';

/**
 * Composable is responsible for app notifications:
 * - encapsulates notification initialization logic including default settings
 * - allows adding new notifications
 */
export const useNotifications = () => {
  const toast = useToast();
  const DEFAULT_LIFE_IN_MS = 3000;

  const add = ({ severity, summary, life }: NotificationOptions) => {
    toast.add({ severity, summary, life: life || DEFAULT_LIFE_IN_MS });
  };

  return {
    add,
  };
};
