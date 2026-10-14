import { computed } from 'vue';
import type { CalendarProps } from './types';

/**
 * Composable is responsible for match api date to date picker date:
 * - check if the date falls on a workday's list, and whether there are any entries
 */
export const useCalendarStatuses = (props: CalendarProps) => {
  const toDateKey = ({
    year,
    month,
    day,
  }: {
    year: number;
    month: number;
    day: number;
  }) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const workDays = computed(() => new Set(props.workingDates));
  const busyDays = computed(() => new Set(props.bookedDates));

  const getDayStatus = (date: { year: number; month: number; day: number }) => {
    const key = toDateKey(date);

    return {
      work: workDays.value.has(key),
      busy: busyDays.value.has(key),
    };
  };

  return { getDayStatus };
};
