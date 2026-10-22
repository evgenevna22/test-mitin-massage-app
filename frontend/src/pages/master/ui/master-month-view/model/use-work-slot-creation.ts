import { computed, type Ref, ref } from 'vue';
import type { TimeSlot } from '@/pages/client/model/slot';
import type { CalendarView } from './types';

type Options = {
  calendarView: Ref<CalendarView>;
  selectedDates: Ref<Date[]>;
  createSlots: (dates: Date[], time: TimeSlot) => Promise<void>;
  reloadVisibleMonthData: () => Promise<void>;
};

export const useWorkSlotCreation = ({
  calendarView,
  selectedDates,
  createSlots,
  reloadVisibleMonthData,
}: Options) => {
  const error = ref('');
  const isCreating = computed(() => calendarView.value === 'creating');

  const startCreating = () => {
    selectedDates.value = [];
    error.value = '';
    calendarView.value = 'creating';
  };

  const cancelCreating = () => {
    error.value = '';
    calendarView.value = 'default';
  };

  const saveWorkSlots = async (timeSlots: TimeSlot) => {
    error.value = '';
    try {
      await createSlots(selectedDates.value, timeSlots);
      await reloadVisibleMonthData();
      calendarView.value = 'default';
    } catch (cause) {
      const responseError = cause as {
        response?: { data?: { error?: string } };
      };
      error.value =
        responseError.response?.data?.error || 'Failed to save slots';
    }
  };

  return {
    error,
    isCreating,
    startCreating,
    cancelCreating,
    saveWorkSlots,
  };
};
