import type { SlotDTO } from '@/pages/client/model/slot';
import { MasterSlotsApi } from '@/pages/master/api/master-slots';
import { useNotifications } from '@/shared/api';

export const useMasterSlotDeletion = () => {
  const notifications = useNotifications();

  const deleteSlot = async (slot: SlotDTO) => {
    if (!slot) {
      return;
    }

    await MasterSlotsApi.deleteSlot(slot.id);

    notifications.add({ severity: 'success', summary: 'Slot deleted' });
  };

  return {
    deleteSlot,
  };
};
