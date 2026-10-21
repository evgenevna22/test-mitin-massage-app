import type { SlotDTO } from '@/types';

export type MasterScheduleProps = {
  selectedDates: Date[];
  slotsByMonth: SlotDTO[];
  isEditingMode?: boolean;
};
