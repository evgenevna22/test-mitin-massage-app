import { ref } from 'vue';
import type { TimeSlot } from '@/pages/client/model/slot';
import { useMasterSlotsLoader } from '@/pages/master/api/use-master-slots-loader';
import { useMasterMonthData } from '@/pages/master/api/use-master-month-data';

export const useWorkSlotCreation = () => {
  const isLoading = ref(false);
  const serverError = ref('');

  const { createSlots } = useMasterSlotsLoader();
  const { loadMonthData } = useMasterMonthData();

  const saveWorkSlots = async (selectedDates: Date[], timeSlots: TimeSlot) => {
    if (isLoading.value) {
      return;
    }

    serverError.value = '';
    isLoading.value = true;

    try {
      await createSlots(selectedDates, timeSlots);
      await loadMonthData(
        selectedDates[0].getFullYear(),
        String(selectedDates[0].getMonth() + 1).padStart(2, '0')
      );
    } catch (cause) {
      const responseError = cause as {
        response?: { data?: { error?: string } };
      };
      serverError.value =
        responseError.response?.data?.error || 'Failed to save slots';
    } finally {
      isLoading.value = false;
    }
  };

  return {
    serverError,
    isLoading,
    saveWorkSlots,
  };
};
