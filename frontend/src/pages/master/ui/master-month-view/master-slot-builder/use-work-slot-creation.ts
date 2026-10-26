import { ref } from 'vue';
import type { TimeSlot } from '@/pages/client/model/slot';
import { useMasterSlotsLoader } from '@/pages/master/api/use-master-slots-loader';
import { useMasterMonthData } from '@/pages/master/api/use-master-month-data';

export const useWorkSlotCreation = () => {
  const isLoading = ref(false);
  const errorMessage = ref('');

  const { createSlots } = useMasterSlotsLoader();
  const { loadMonthData } = useMasterMonthData();

  const saveWorkSlots = async (selectedDates: Date[], timeSlots: TimeSlot) => {
    if (isLoading.value) {
      return;
    }

    errorMessage.value = '';
    isLoading.value = true;

    try {
      await createSlots(selectedDates, timeSlots);
      await loadMonthData(
        selectedDates[0].getFullYear(),
        String(selectedDates[0].getMonth() + 1).padStart(2, '0')
      );
    } catch (error) {
      const responseError = error as {
        response?: { data?: { error?: string } };
      };
      errorMessage.value =
        responseError.response?.data?.error || 'Failed to save slots';
    } finally {
      isLoading.value = false;
    }
  };

  return {
    errorMessage,
    isLoading,
    saveWorkSlots,
  };
};
