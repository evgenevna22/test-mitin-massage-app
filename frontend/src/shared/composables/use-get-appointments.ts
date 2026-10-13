import { computed, onMounted, ref } from 'vue';
import { SlotsApi } from '@/api/slots';
import { useSlots } from '.';
import { useSlotsStore } from '@stores/slots';

/**
 * Composable is responsible for client appointments:
 * - loads free appointments by selected month
 * - loads free slots for selected day
 */
export const useGetAppointments = () => {
  const today = new Date();
  const currentMonth = ref(String(today.getMonth() + 1).padStart(2, '0'));
  const currentYear = ref(today.getFullYear());

  const slotsStore = useSlotsStore();
  const { getSlots } = useSlots();

  const appointments = computed(() => slotsStore.appointments);
  const currentDate = computed(() => slotsStore.currentDate);

  const getAppointments = async (
    year = currentYear.value,
    month = currentMonth.value
  ) => {
    if (slotsStore.areAppointmentsLoading) {
      return;
    }

    try {
      slotsStore.setAppointmentsLoading(true);
      const appointments = await SlotsApi.getAppointments(year, month);
      slotsStore.setAppointments(appointments ?? []);
    } finally {
      slotsStore.setAppointmentsLoading(false);
    }
  };

  const selectDate = async (date: string) => {
    if (date === currentDate.value) {
      return;
    }

    slotsStore.selectDate(date);
    await getSlots();
  };

  const selectMonth = async (year: number, month: number) => {
    currentYear.value = year;
    currentMonth.value = String(month).padStart(2, '0');

    await getAppointments(year, currentMonth.value);
  };

  onMounted(getAppointments);

  return {
    appointments,
    currentDate,
    selectDate,
    getAppointments,
    selectMonth,
  };
};
