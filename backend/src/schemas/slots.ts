import { z } from 'zod';
import { HOUR_IN_MIN, MIN_SLOT_DURATION_IN_MINS } from '../consts';

export const TimeScheme = z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/);
export const DateScheme = z
  .string()
  .regex(/^\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/)
  .refine((value) => {
    const date = new Date(`${value}T00:00:00.000Z`);
    return (
      !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
    );
  });

export type SlotStatus = 'free' | 'booked';

// Firestore Slot model
export const SlotSchema = z.object({
  id: z.string(), // ID: masterId_date_time
  masterId: z.string().min(1), // Telegram master ID
  date: DateScheme, // "YYYY-MM-DD"
  time: TimeScheme, // "HH:mm"
  status: z.enum(['free', 'booked']),
  isConfirmed: z.boolean().default(false),
  comment: z.string().max(500).nullable().optional(),
  massageType: z.string().default(''),
  userId: z.number().nullable(), // Telegram client ID
  userName: z.string().nullable(), // Telegram client username
  userNickname: z.string().nullable(), // Telegram client nickname
});

export const BookSlotSchema = z.object({
  massageType: z.string().trim().min(1).max(100),
  comment: z.string().trim().max(500).optional(),
});

export const CreateDateSlotSchema = z.array(DateScheme).min(1);

export const CreateTimeSlotSchema = z
  .object({
    start: TimeScheme,
    end: TimeScheme,
  })
  .refine(({ start, end }) => start < end, {
    path: ['end'],
    message: 'End time must be later than start time',
  })
  .refine(
    ({ start, end }) => {
      const toMinutes = (time: string) => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * HOUR_IN_MIN + minutes;
      };

      return toMinutes(end) - toMinutes(start) >= MIN_SLOT_DURATION_IN_MINS;
    },
    {
      path: ['end'],
      message: `Time range must be at least ${MIN_SLOT_DURATION_IN_MINS} minutes`,
    }
  );

export const SlotPayloadSchema = z.object({
  dates: CreateDateSlotSchema,
  time: CreateTimeSlotSchema,
});

export const ReschedulePayloadSchema = z.object({
  sourceSlotId: z.string().min(1),
  targetSlotId: z.string().min(1),
  comment: z.string().max(500),
});
