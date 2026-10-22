import { onMounted, ref } from 'vue';
import { MasterSlotsApi } from '../../api/master-slots';
import type { SlotDTO } from '@/shared/model';
import { useNotifications } from '@/shared/api';

export const useMasterBookingsLoader = () => {
  const notifications = useNotifications();

  const upcomingSlots = ref<SlotDTO[]>([]);
  const isLoading = ref(false);

  const getUpcomingSlots = async () => {
    if (isLoading.value) {
      return;
    }

    try {
      isLoading.value = true;
      upcomingSlots.value = await MasterSlotsApi.getUpcomingSlots();
    } catch (error) {
      console.error(error);
      notifications.add({
        severity: 'error',
        summary: "upcoming slots wasn't loaded",
      });
    } finally {
      isLoading.value = false;
    }
  };

  onMounted(getUpcomingSlots);

  return {
    upcomingSlots,
    isLoading,
  };
};
