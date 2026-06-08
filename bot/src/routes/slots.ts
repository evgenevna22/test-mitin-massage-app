import { Request, Response, Router } from 'express'
import { db } from '../firebase'
import { SlotSchema, type Slot } from '../types'
import { verifyTelegram } from '../middleware/verify-telegram'
import { sendError } from '../helpers'

const router = Router()

router.get('/', async (req: Request, res: Response) => {
  const { month } = req.query

  if (!month) {
    sendError(res, 400, 'Param `month` is required')

    return
  }

  const from = `2026-${month}-01`
  const to = `2026-${month}-31`

  try {
    const result = await db
      .collection('slots')
      .where('date', '>=', from)
      .where('date', '<=', to)
      .get()

      console.log('result', result.docs)

    const slots: Slot[] = result.docs
      .map((doc) => {
        const data = {
          id: doc.id,
          ...doc.data(),
        }
        return SlotSchema.parse(data)
      })
      .sort(
        (a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time)
      )

    res.json(slots)
  } catch (error) {
    console.error('Ошибка при получении слотов:', error)

    sendError(res, 500, 'Не удалось получить слоты')
  }
})

router.post('/:id/book', async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    if (typeof id !== 'string') {
      sendError(res, 400, 'Param `id` must be a string type')

      return
    }
    const slotReference = db.collection('slots').doc(id)
    const slotDocument = await slotReference.get()

    if (!slotDocument.exists) {
      sendError(res, 404, 'Slot is not defined')

      return
    }

    const slot = slotDocument.data()

    if (slot?.status === 'booked') {
      sendError(res, 409, 'Slot is already booked')

      return
    }

    await slotReference.update({
      status: 'booked',
      userId: req.telegramUser.id,
      userName: req.telegramUser.first_name,
      userNickname: req.telegramUser.username ?? null,
    })

    res.json({ success: true })
  } catch (error) {
    console.error('Error while booking', error)

    sendError(res, 500, "The booking's finished with error")
  }
})

router.patch('/:id/cancel', async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    if (typeof id !== 'string') {
      sendError(res, 400, 'Param `id` must be a string type')

      return
    }
    const slotReference = db.collection('slots').doc(id)
    const slotDocument = await slotReference.get()

    if (!slotDocument.exists) {
      sendError(res, 404, 'Slot is not defined')

      return
    }

    const slot = slotDocument.data()

    if (slot?.status === 'free') {
      sendError(res, 409, 'Slot is already free')

      return
    }

    if (slot?.userId !== req.telegramUser.id) {
      sendError(
        res,
        403,
        "Cancelling the someone else's appointment is forbidden"
      )

      return
    }

    await slotReference.update({
      status: 'free',
      userId: null,
      userName: null,
      userNickname: null,
    })

    res.json({ success: true })
  } catch (error) {
    console.error('Error while cancelling', error)

    res.status(500).json({ error: 'The booking was not cancelled' })
  }
})

router.use(verifyTelegram)

export default router
