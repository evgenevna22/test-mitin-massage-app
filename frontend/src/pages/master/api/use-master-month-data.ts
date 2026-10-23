import { ref } from 'vue';
import { useNotifications } from '@/shared/api';
import type { MonthOccupancy } from '../model';
import type { SlotDTO } from '@/shared/model';
import { MasterSlotsApi } from './master-slots';

/** Loads detailed slots and calendar occupancy for one month together. */
export const useMasterMonthData = () => {
  const notifications = useNotifications();

  const slotsDetailsByMonth = ref<SlotDTO[]>([]);

  const monthOccupancy = ref<MonthOccupancy>({
    workingDates: [],
    bookedDates: [],
    datesWithFreeSlots: [],
  });

  const isMonthDataLoading = ref(false);

  const loadMonthData = async (year: number, month: string) => {
    isMonthDataLoading.value = true;
    try {
      const [detailedSlots, calendarOccupancy] = await Promise.all([
        MasterSlotsApi.getDetailedSlotsForMonth(year, month),
        MasterSlotsApi.getCalendarOccupancyForMonth(year, month),
      ]);

      slotsDetailsByMonth.value = detailedSlots;
      monthOccupancy.value = calendarOccupancy;
    } catch (error) {
      console.error(error);
      notifications.add({
        severity: 'error',
        summary: "Month's slot data couldn't be loaded",
      });
    } finally {
      isMonthDataLoading.value = false;
    }
  };

  return {
    slotsDetailsByMonth,
    monthOccupancy,
    isMonthDataLoading,
    loadMonthData,
  };
};
