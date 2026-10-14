import { SlotsApi } from '@/api/slots';
import { ref } from 'vue';
import { useNotifications } from './use-notifications';

/**
 * Composable is responsible for getting working and booked dates
 */
export const useAdminMonthDates = () => {
  const notifications = useNotifications();

  const workingDates = ref<string[]>([]);
  const bookedDates = ref<string[]>([]);
  const isLoading = ref(false);

  const loadMonthDates = async (year: number, month: string) => {
    try {
      isLoading.value = true;
      const [working, booked] = await Promise.all([
        SlotsApi.getWorkingDates(year, month),
        SlotsApi.getBookedDates(year, month),
      ]);
      workingDates.value = working;
      bookedDates.value = booked;
    } catch (error) {
      console.error(error);
      notifications.add({
        severity: 'error',
        summary: "Slots weren't loaded",
      });
    } finally {
      isLoading.value = false;
    }
  };

  return {
    workingDates,
    bookedDates,
    isLoading,
    loadMonthDates,
  };
};
