import { Request, Response, Router } from 'express';
import { db } from '../../firebase';
import { BookSlotSchema, DateScheme, SlotSchema, type Slot } from '../../types';
import { verifyTelegram } from '../../middleware/verify-telegram';
import { isMonthValid, isYearValid, sendError } from '../../helpers';
import { TelegramService } from '../../telegram';
import { config } from '../../types/config';

const router = Router();

router.use(verifyTelegram);

const toClientSlot = ({ id, date, time, status }: Slot) => ({
  id,
  date,
  time,
  status,
});

// Public list used by clients to choose a master's calendar.
router.get('/masters', (_req: Request, res: Response) => {
  res.json(
    config.MASTER_TELEGRAM_IDS.map((id, index) => ({
      id,
      name: `Master ${index + 1}`,
    }))
  );
});

// api to receive free slots for a specific day and master
router.get('/:masterId/date/:date', async (req: Request, res: Response) => {
  const { masterId, date } = req.params;

  if (typeof masterId !== 'string') {
    sendError(res, 400, 'Param `masterId` must be in proper format');

    return;
  }

  if (!config.MASTER_TELEGRAM_IDS.includes(masterId)) {
    sendError(res, 404, 'Master is not defined');
    return;
  }

  if (!DateScheme.safeParse(date).success) {
    sendError(res, 400, 'Param `date` must be in YYYY-MM-DD format');

    return;
  }

  try {
    const result = await db
      .collection('slots')
      .where('masterId', '==', masterId)
      .where('date', '==', date)
      .where('status', '==', 'free')
      .get();

    const slots = result.docs
      .map((doc) => {
        const data = {
          id: doc.id,
          ...doc.data(),
        };
        return SlotSchema.parse(data);
      })
      .map(toClientSlot)
      .sort(
        (a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time)
      );

    res.json(slots);
  } catch (error) {
    console.error('Error retrieving slots:', error);

    sendError(res, 500, 'Error retrieving slots');
  }
});

// api to receive only free slots for a specific month
router.get(
  '/availability/:masterId/:year/:month',
  async (req: Request, res: Response) => {
    const { masterId, year, month } = req.params;

    if (typeof masterId !== 'string') {
      sendError(res, 400, 'Param `masterId` must be in proper format');

      return;
    }

    if (!config.MASTER_TELEGRAM_IDS.includes(masterId)) {
      sendError(res, 404, 'Master is not defined');
      return;
    }

    if (
      typeof year !== 'string' ||
      typeof month !== 'string' ||
      !isYearValid(year) ||
      !isMonthValid(month)
    ) {
      sendError(
        res,
        400,
        'Params `year` and `month` must be in YYYY/MM format'
      );

      return;
    }

    const now = new Date();
    const isCurrentMonth =
      now.getFullYear() === Number(year) &&
      now.getMonth() + 1 === Number(month);
    const lastDay = new Date(Number(year), Number(month), 0).getDate();
    const from = `${year}-${month}-${isCurrentMonth ? String(now.getDate()).padStart(2, '0') : '01'}`;
    const to = `${year}-${month}-${String(lastDay).padStart(2, '0')}`;

    try {
      const result = await db
        .collection('slots')
        .where('masterId', '==', masterId)
        .where('status', '==', 'free')
        .where('date', '>=', from)
        .where('date', '<=', to)
        .get();

      const slots = result.docs
        .map((doc) => {
          const data = {
            id: doc.id,
            ...doc.data(),
          };
          return SlotSchema.parse(data);
        })
        .map(toClientSlot)
        .sort(
          (a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time)
        );

      res.json(slots);
    } catch (error) {
      console.error('Error retrieving slots:', error);

      sendError(res, 500, 'Error retrieving slots');
    }
  }
);

// api to book slot by id
router.put('/:id/book', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const bookingDetails = BookSlotSchema.safeParse(req.body);

    if (typeof id !== 'string') {
      sendError(res, 400, 'Param `id` must be a string type');

      return;
    }

    if (!bookingDetails.success) {
      sendError(res, 400, 'A massage type is required to book a slot');

      return;
    }
    const slotReference = db.collection('slots').doc(id);
    const slot = await db.runTransaction(async (transaction) => {
      const slotDocument = await transaction.get(slotReference);

      if (!slotDocument.exists) {
        throw Object.assign(new Error('Slot is not defined'), { status: 404 });
      }

      const currentSlot = slotDocument.data() as Slot;
      if (currentSlot.status !== 'free') {
        throw Object.assign(new Error('Slot is already booked'), {
          status: 409,
        });
      }

      transaction.update(slotReference, {
        status: 'booked',
        isConfirmed: false,
        massageType: bookingDetails.data.massageType,
        comment: bookingDetails.data.comment || null,
        userId: req.telegramUser.id,
        userName: req.telegramUser.first_name,
        userNickname: req.telegramUser.username ?? null,
      });

      return currentSlot;
    });

    TelegramService.sendMasterNotification(
      slot.masterId,
      `The slot on ${slot.date} was booked by '@${req.telegramUser.username}'`
    );

    TelegramService.sendClientNotification(
      req.telegramUser.id,
      `You succesefully booked the slot on ${slot.date} at ${slot.time}'`
    );

    res.json({ success: true });
  } catch (error) {
    if (error instanceof Error && 'status' in error) {
      const status = error.status;
      if (status === 404 || status === 409) {
        sendError(res, status, error.message);
        return;
      }
    }

    console.error('Error while booking', error);

    sendError(res, 500, "The booking's finished with error");
  }
});

// api to cancel slot by id
router.patch('/:id/cancel', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (typeof id !== 'string') {
      sendError(res, 400, 'Param `id` must be a string type');

      return;
    }
    const slotReference = db.collection('slots').doc(id);
    const slotDocument = await slotReference.get();

    if (!slotDocument.exists) {
      sendError(res, 404, 'Slot is not defined');

      return;
    }

    const slot = slotDocument.data();

    if (slot?.status === 'free') {
      sendError(res, 409, 'Slot is already free');

      return;
    }

    if (slot?.userId !== req.telegramUser.id) {
      sendError(
        res,
        403,
        "Cancelling the someone else's appointment is forbidden"
      );

      return;
    }

    await slotReference.update({
      status: 'free',
      isConfirmed: false,
      massageType: '',
      comment: null,
      userId: null,
      userName: null,
      userNickname: null,
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error while cancelling', error);

    res.status(500).json({ error: 'The booking was not cancelled' });
  }
});

export default router;
