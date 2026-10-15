import { AdminSlotsApi } from '@/api/admin-slots';
import { ref } from 'vue';
import { useNotifications } from './use-notifications';

/**
 * Composable is responsible for getting working and booked dates
 */
export const useAdminMonthDates = () => {
  const notifications = useNotifications();

  const workingDates = ref<string[]>([]);
  const bookedDates = ref<string[]>([]);
  const isMonthDatesLoading = ref(false);

  const loadMonthDates = async (year: number, month: string) => {
    try {
      isMonthDatesLoading.value = true;
      const [working, booked] = await Promise.all([
        AdminSlotsApi.getWorkingDates(year, month),
        AdminSlotsApi.getBookedDates(year, month),
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
      isMonthDatesLoading.value = false;
    }
  };

  return {
    workingDates,
    bookedDates,
    isMonthDatesLoading,
    loadMonthDates,
  };
};
