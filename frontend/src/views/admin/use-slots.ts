import { reactive, ref } from 'vue';
import { MasterSlotsApi } from '@/api/master-slots';
import type { SlotDTO, TimeSlot } from '@/types';
import { transformDate } from '@utils';
import { useNotifications } from '@/shared/composables';

export const useSlots = () => {
  const notifications = useNotifications();

  const slotsByMonth = ref<SlotDTO[] | undefined>([]);

  const loadingStatus = reactive({
    creatingSlots: false,
    gettingSlots: false,
  });

  const createSlots = async (dates: Date[], time: TimeSlot) => {
    if (loadingStatus.creatingSlots) {
      return;
    }
    loadingStatus.creatingSlots = true;

    try {
      const transformedDates = dates.map(transformDate);
      await MasterSlotsApi.createSlots({ dates: transformedDates, time });
      notifications.add({ severity: 'success', summary: "slots're saved" });
    } catch (error) {
      console.error(error);
      notifications.add({
        severity: 'error',
        summary: "slots haven't been saved",
      });
    } finally {
      loadingStatus.creatingSlots = false;
    }
  };

  const getSlotsByMonth = async (year: number, month: string) => {
    if (loadingStatus.gettingSlots) {
      return;
    }
    loadingStatus.gettingSlots = true;

    try {
      slotsByMonth.value = await MasterSlotsApi.getSlotsByMonth(year, month);
    } catch (error) {
      console.error(error);
      notifications.add({
        severity: 'error',
        summary: "slots haven't been loaded",
      });
    } finally {
      loadingStatus.gettingSlots = false;
    }
  };

  return {
    slotsByMonth,
    loadingStatus,
    createSlots,
    getSlotsByMonth,
  };
};
