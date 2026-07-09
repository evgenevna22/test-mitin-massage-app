import { Request, Response, Router } from 'express'
import { config } from '../config'
import { verifyTelegram } from '../middleware/verify-telegram'

const router = Router()

router.use(verifyTelegram)

router.get('/', async (req: Request, res: Response) => {
  const { id } = req.telegramUser

  if (config.MASTER_TELEGRAM_ID === id.toString()) {
    res.json('admin')
    return
  }

  // todo: there should another logic: if there is no ID, so the user isn't from telegram
  res.json('client')
})

export default router
