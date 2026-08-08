import { Request, Response, Router } from 'express'
import { config } from '../config'
import { verifyTelegram } from '../middleware/verify-telegram'
import { sendError } from '../helpers'

const router = Router()

router.use(verifyTelegram)

/**
 * This route is responsible for reterning the role. Additionally:
 * - if the user is admin, they can change the role to see the app through client's app and return back.
 * So there is the condition: if initially the role was admin, the flag `canSwitchRole` is true.
 */
router.get('/', async (req: Request, res: Response) => {
  const { id } = req.telegramUser

  const roleMode = req.headers['role-mode']

  const isAdmin =
    config.MASTER_TELEGRAM_ID === id || config.ADMIN_TELEGRAM_ID === id

  if (isAdmin && roleMode) {
    res.json({ role: roleMode, canSwitchRole: isAdmin })
    return
  }

  if (isAdmin) {
    res.json({ role: 'admin', canSwitchRole: isAdmin })
    return
  }

  if (!id) {
    sendError(res, 403, "You don't have permissions to be here.")
    return
  }

  res.json({ role: 'client', canSwitchRole: isAdmin })
})

export default router
