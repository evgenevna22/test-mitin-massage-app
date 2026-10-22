import { reactive } from 'vue';
import { MasterSlotsApi } from './master-slots';
import type { TimeSlot } from '@/shared/model';
import { transformDate } from '@shared/lib';
import { useNotifications } from '@/shared/api';

export const useMasterSlotsLoader = () => {
  const notifications = useNotifications();

  const loadingStatus = reactive({
    creatingSlots: false,
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
      notifications.add({
        severity: 'error',
        summary: "slots haven't been saved",
      });
      throw error;
    } finally {
      loadingStatus.creatingSlots = false;
    }
  };

  return {
    loadingStatus,
    createSlots,
  };
};
