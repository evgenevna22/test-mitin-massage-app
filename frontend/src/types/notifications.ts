import type { ToastMessageOptions } from 'primevue/toast';

export type NotificationOptions = {
  severity: ToastMessageOptions['severity'];
  summary: ToastMessageOptions['summary'];
  life?: ToastMessageOptions['life'];
};
