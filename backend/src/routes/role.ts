import { Request, Response, Router } from 'express';
import { config } from '../types/config';
import { verifyTelegram } from '../middleware/verify-telegram';
import { sendError } from '../helpers';

const router = Router();

router.use(verifyTelegram);

/**
 * This route is responsible for reterning the role. Additionally:
 * Masters can switch between their schedule view and the client experience.
 */
router.get('/', async (req: Request, res: Response) => {
  const { id } = req.telegramUser;

  const roleMode = req.headers['role-mode'];

  const isMaster = config.MASTER_TELEGRAM_IDS.includes(String(id));

  if (isMaster && roleMode === 'client') {
    res.json({ role: 'client', canSwitchRole: true });
    return;
  }

  if (isMaster) {
    res.json({ role: 'master', canSwitchRole: true });
    return;
  }

  if (!id) {
    sendError(res, 403, "You don't have permissions to be here.");
    return;
  }

  res.json({ role: 'client', canSwitchRole: false });
});

export default router;
