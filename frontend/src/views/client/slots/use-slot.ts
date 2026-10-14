import { SlotsApi } from '@/api/slots';
import type { BookSlotPayload } from '@/types';
import { useNotifications } from '@/shared/composables';

export const useSlot = () => {
  const notifications = useNotifications();

  const selectSlot = async (id: string, payload: BookSlotPayload) => {
    try {
      await SlotsApi.bookSlot(id, payload);

      notifications.add({
        severity: 'success',
        summary: 'Slot was successufully booked',
      });
    } catch (error) {
      console.error(error);
      notifications.add({
        severity: 'error',
        summary: "Sorry, slot wasn't booked",
      });
    }
  };

  return {
    selectSlot,
  };
};
