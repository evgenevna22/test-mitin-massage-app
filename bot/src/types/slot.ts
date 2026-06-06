import { z } from 'zod'

// Возможные статусы слота
export type SlotStatus = 'free' | 'booked'

// Модель слота как она хранится в Firestore
export const SlotSchema = z.object({
  id: z.string(), // автогенерированный ID документа
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // формат "YYYY-MM-DD"
  time: z.string().regex(/^\d{2}:\d{2}/), // формат "HH:MM"
  status: z.enum(['free', 'booked']),
  userId: z.number().nullable(), // Telegram ID клиента
  userName: z.string().nullable(), // имя клиента
  userNickname: z.string().nullable(), // @ник клиента
})

export const BookStolSchema = z.object({
  userId: z.number(), // Telegram ID клиента
  userName: z.string().min(1), // имя клиента
  userNickname: z.string(), // @ник клиента
})

export type Slot = z.infer<typeof SlotSchema>
export type BookSlot = z.infer<typeof BookStolSchema>
