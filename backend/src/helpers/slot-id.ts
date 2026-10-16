import type { DateSlot, TimeSlot } from '../types';

export const buildSlotId = (
  masterId: string,
  date: DateSlot,
  time: TimeSlot
) => `${encodeURIComponent(masterId)}_${date}_${time}`;
