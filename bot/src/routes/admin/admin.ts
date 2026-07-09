import { Request, Response, Router } from 'express'
import { db } from '../../firebase'
import { getHourInMs, getMinInMs, sendError } from '../../helpers'
import {
  SlotPayloadSchema,
  Slot,
  SlotSchema,
  type DateSlot,
  type TimeSlot,
} from '../../types'
import { verifyAdmin } from '../../middleware/verify-admin'
import { verifyTelegram } from '../../middleware/verify-telegram'

const router = Router()

router.use(verifyTelegram)
router.use(verifyAdmin)

router.post('/slots', async (req: Request, res: Response) => {
  const slots = SlotPayloadSchema.parse(req.body)

  // date format: 'YYYY-MM-DD'
  // time format: 'HH:MM'

  const { dates, time } = slots

  const createTimeSlots = (date: DateSlot): TimeSlot[] => {
    const [year, month, day] = date.split('-')

    const [startHour, startMin] = time.start.split(':').map(Number)
    const [endHour, endMin] = time.end.split(':').map(Number)
    const [durHour, durMin] = time.duration.split(':').map(Number)
    const [gapHour, gapMin] = time.gap.split(':').map(Number)

    const dateSlot = new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      startHour,
      startMin
    )

    const timeSlots: TimeSlot[] = [time.start]

    const durInMs = getHourInMs(durHour) + getMinInMs(durMin)
    const gapInMs = getHourInMs(gapHour) + getMinInMs(gapMin)

    for (
      let i = { hour: startHour, min: startMin };
      i.hour < endHour || (i.hour === endHour && i.min <= endMin);
    ) {
      const diffMs = dateSlot.getTime() + durInMs + gapInMs

      dateSlot.setTime(diffMs)
      i = {
        hour: dateSlot.getHours(),
        min: dateSlot.getMinutes(),
      }
      timeSlots.push(`${i.hour}:${i.min.toString().padStart(2, '0')}`)
    }

    return timeSlots
  }

  try {
    const batch = db.batch()

    for (const date of dates) {
      for (const time of createTimeSlots(date)) {
        const ref = db.collection('slots').doc()
        batch.set(ref, {
          date,
          time,
          status: 'free',
          userId: null,
          userName: null,
          userNickname: null,
        })
      }
    }

    await batch.commit()

    res.json({ success: true })
  } catch (error) {
    console.error('Ошибка сохранении слотов:', error)

    sendError(res, 500, 'Не удалось сохранить слоты')
  }
})

router.get('/upcoming', async (req: Request, res: Response) => {
  //where('status','==','booked').where('date','>=', today).orderBy('date').orderBy('time').limit(10)

  const today = new Date()
  const transformDate = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  try {
    const result = await db
      .collection('slots')
      .where('status', '==', 'booked')
      .where('date', '>=', transformDate(today))
      .orderBy('date')
      .orderBy('time')
      .limit(10)
      .get()

    console.log('result', result.docs)

    const slots: Slot[] = result.docs.map((doc) => {
      const data = {
        id: doc.id,
        ...doc.data(),
      }
      return SlotSchema.parse(data)
    })
    // .sort(
    //   (a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time)
    // )

    res.json(slots)
  } catch (error) {
    console.error('Ошибка при получении слотов:', error)

    sendError(res, 500, 'Не удалось получить слоты')
  }
})

export default router
