import type { SlotDTO } from '@/types';
import { computed } from 'vue';
import type { AdminScheduleProps } from './types';

export const useSlotsSchedule = (props: AdminScheduleProps) => {
  const slotsByDate = computed<Record<string, SlotDTO[]>>(() => {
    return props.slotsByMonth.reduce<Record<string, SlotDTO[]>>(
      (slots, slot) => {
        if (!slots[slot.date]) {
          slots[slot.date] = [];
        }

        slots[slot.date].push(slot);

        return slots;
      },
      {}
    );
  });

  return {
    slotsByDate,
  };
};
