import type { SlotDTO } from '@/shared/model';

export type MasterScheduleProps = {
  selectedDates: Date[];
  slotsDetailsByMonth: SlotDTO[];
  isEditingMode?: boolean;
};
