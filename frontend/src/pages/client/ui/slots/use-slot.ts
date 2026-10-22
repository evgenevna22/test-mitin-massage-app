import { ClientSlotsApi } from '../../api/client-slots';
import type { BookSlotPayload } from '@/shared/model';
import { useNotifications } from '@/shared/api';

export const useSlot = () => {
  const notifications = useNotifications();

  const selectSlot = async (id: string, payload: BookSlotPayload) => {
    try {
      await ClientSlotsApi.bookSlot(id, payload);

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
