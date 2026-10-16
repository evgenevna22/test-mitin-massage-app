import { z } from 'zod';

export const TimeScheme = z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/);
export const DateScheme = z
  .string()
  .regex(/^\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/)
  .refine((value) => {
    const date = new Date(`${value}T00:00:00.000Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
  });

// Возможные статусы слота
export type SlotStatus = 'free' | 'booked';

// Модель слота как она хранится в Firestore
export const SlotSchema = z.object({
  id: z.string(), // детерминированный ID: masterId_date_time
  masterId: z.string().min(1), // Telegram ID мастера в строковом формате
  date: DateScheme, // формат "YYYY-MM-DD"
  time: TimeScheme, // формат "HH:mm"
  status: z.enum(['free', 'booked']),
  isConfirmed: z.boolean().default(false),
  comment: z.string().max(500).nullable().optional(),
  massageType: z.string().default(''),
  userId: z.number().nullable(), // Telegram ID клиента
  userName: z.string().nullable(), // имя клиента
  userNickname: z.string().nullable(), // @ник клиента
});

export const BookSlotSchema = z.object({
  massageType: z.string().trim().min(1).max(100),
  comment: z.string().trim().max(500).optional(),
});

export const CreateDateSlotSchema = z.array(DateScheme).min(1);
export const CreateTimeSlotSchema = z.object({
  start: TimeScheme,
  end: TimeScheme,
});

export const SlotPayloadSchema = z.object({
  dates: CreateDateSlotSchema,
  time: CreateTimeSlotSchema,
});

export type Slot = z.infer<typeof SlotSchema>;
export type BookSlot = z.infer<typeof BookSlotSchema>;

export type SlotPayload = z.infer<typeof SlotPayloadSchema>;
export type CreateDateSlot = z.infer<typeof CreateDateSlotSchema>;
export type CreateTimeSlot = z.infer<typeof CreateTimeSlotSchema>;
export type TimeSlot = z.infer<typeof TimeScheme>;
export type DateSlot = z.infer<typeof DateScheme>;
