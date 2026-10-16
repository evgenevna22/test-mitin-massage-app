import { ClientSlotsApi } from '@/api/client-slots';
import { useSlotsStore } from '@stores/slots';
import { useNotifications } from './use-notifications';

/**
 * Composable is responsible for getting available slots:
 * - loads available slots based on selected date
 */
export const useSlots = () => {
  const notifications = useNotifications();
  const slotsStore = useSlotsStore();

  const getSlotsByDay = async () => {
    if (
      slotsStore.areCurrentSlotsLoading ||
      !slotsStore.selectedDate ||
      !slotsStore.selectedMasterId
    ) {
      return;
    }

    try {
      slotsStore.setCurrentSlotsLoading(true);
      const slots = await ClientSlotsApi.getSlots(
        slotsStore.selectedMasterId,
        slotsStore.selectedDate
      );

      if (!slots?.length) {
        throw Error;
      }

      slotsStore.setCurrentSlots(slots);
    } catch (error) {
      console.error(error);
      notifications.add({
        severity: 'error',
        summary: "Slots weren't loaded",
      });
    } finally {
      slotsStore.setCurrentSlotsLoading(false);
    }
  };

  return {
    getSlotsByDay,
  };
};
