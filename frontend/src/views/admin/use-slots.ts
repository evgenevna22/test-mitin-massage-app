import { ref } from 'vue';
import { SlotsApi } from '@/api/slots';
import type { TimeSlot } from '@/types';
import { transformDate } from '@utils';
import { useNotifications } from '@/shared/composables';

export const useSlots = () => {
  const notifications = useNotifications();

  const isLoading = ref(false);

  const createSlots = async (dates: Date[], time: TimeSlot) => {
    if (isLoading.value) {
      return;
    }
    isLoading.value = true;

    try {
      const transformedDates = dates.map(transformDate);
      await SlotsApi.createSlots({ dates: transformedDates, time });
      notifications.add({ severity: 'success', summary: "slots're saved" });
    } catch (error) {
      console.error(error);
      notifications.add({
        severity: 'error',
        summary: "slots haven't been saved",
      });
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isLoading,
    createSlots,
  };
};
