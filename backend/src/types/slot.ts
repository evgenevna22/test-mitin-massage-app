import { z } from 'zod';
import {
  SlotSchema,
  BookSlotSchema,
  SlotPayloadSchema,
  CreateDateSlotSchema,
  CreateTimeSlotSchema,
  TimeScheme,
  DateScheme,
} from '../schemas';

export type SlotPayload = z.infer<typeof SlotPayloadSchema>;

export type Slot = z.infer<typeof SlotSchema>;
export type BookSlot = z.infer<typeof BookSlotSchema>;

export type CreateDateSlot = z.infer<typeof CreateDateSlotSchema>;
export type CreateTimeSlot = z.infer<typeof CreateTimeSlotSchema>;

export type TimeSlot = z.infer<typeof TimeScheme>;
export type DateSlot = z.infer<typeof DateScheme>;
