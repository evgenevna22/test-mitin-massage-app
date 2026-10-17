import type { SlotDTO } from '@/types';
import { computed } from 'vue';
import type { MasterScheduleProps } from './types';

export const useSlotsSchedule = (props: MasterScheduleProps) => {
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
