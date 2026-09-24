import { SlotsApi } from '@/api/slots';
import { useSlotsStore } from '@stores/slots';
import { useNotifications } from './use-notifications';

/**
 * Composable is responsible for getting available slots:
 * - loads available slots based on current date
 */
export const useSlots = () => {
  const notifications = useNotifications();
  const slotsStore = useSlotsStore();

  const getSlots = async () => {
    if (slotsStore.areCurrentSlotsLoading || !slotsStore.currentDate) {
      return;
    }

    try {
      slotsStore.setCurrentSlotsLoading(true);
      const slots = await SlotsApi.getSlots(slotsStore.currentDate);

      if (!slots?.length) {
        throw Error;
      }

      slotsStore.setCurrentSlots(slots);
    } catch (error) {
      console.error(error);
      notifications.add({
        severity: 'error',
        summary: 'Slots weren\'t loaded',
      });
    } finally {
      slotsStore.setCurrentSlotsLoading(false);
    }
  };

  return {
    getSlots,
  };
};
