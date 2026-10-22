import type { SlotDTO } from '@/shared/model';
import { computed } from 'vue';
import type { MasterScheduleProps } from './types';

export const useSlotsSchedule = (props: MasterScheduleProps) => {
  const slotsByDate = computed<Record<string, SlotDTO[]>>(() => {
    return props.slotsDetailsByMonth.reduce<Record<string, SlotDTO[]>>(
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
