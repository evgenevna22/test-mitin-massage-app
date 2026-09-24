import { onMounted, ref } from 'vue';
import { SlotsApi } from '@/api/slots';
import type { SlotDTO } from '@/types';
import { useNotifications } from '@/shared/composables';

export const useUpcomingSlots = () => {
  const notifications = useNotifications();

  const upcomingSlots = ref<SlotDTO[]>([]);
  const isLoading = ref(false);

  const getUpcomingSlots = async () => {
    if (isLoading.value) {
      return;
    }

    try {
      isLoading.value = true;
      upcomingSlots.value = await SlotsApi.loadUpcomingSlots();
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
