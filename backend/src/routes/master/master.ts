import { Router } from 'express';
import { verifyMaster } from '../../middleware/verify-master';
import { verifyTelegram } from '../../middleware/verify-telegram';
import calendarRouter from './calendar';
import slotsRouter from './slots';

const router = Router();

router.use(verifyTelegram);
router.use(verifyMaster);
router.use(calendarRouter);
router.use(slotsRouter);

export default router;
