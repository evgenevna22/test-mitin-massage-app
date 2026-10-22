import { ref } from 'vue';
import type { VisibleMonth } from './types';

type MonthChange = { month: number; year: number };

export const useMonthNavigation = (
  loadMonthData: (year: number, month: string) => Promise<void>
) => {
  const today = new Date();

  const visibleMonth = ref<VisibleMonth>({
    year: today.getFullYear(),
    month: today.getMonth() + 1,
  });
  const selectedDates = ref<Date[]>([]);

  const selectDates = (value: Date | Date[]) => {
    selectedDates.value = Array.isArray(value) ? value : [value];
  };

  const reloadVisibleMonthData = () => {
    const { year, month } = visibleMonth.value;
    return loadMonthData(year, String(month).padStart(2, '0'));
  };

  const handleMonthChange = async ({ month, year }: MonthChange) => {
    visibleMonth.value = { year, month };
    await reloadVisibleMonthData();
  };

  return {
    visibleMonth,
    selectedDates,
    selectDates,
    handleMonthChange,
    reloadVisibleMonthData,
  };
};
