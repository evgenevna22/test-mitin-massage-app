import { Request, Response, Router } from 'express';
import { db } from '../../firebase';
import { BookSlotSchema, SlotSchema, type Slot } from '../../types';
import { verifyTelegram } from '../../middleware/verify-telegram';
import { isMonthValid, isYearValid, sendError } from '../../helpers';
import { TelegramService } from '../../telegram';

const router = Router();

router.use(verifyTelegram);

const toClientSlot = ({ id, date, time, status }: Slot) => ({
  id,
  date,
  time,
  status,
});

// api to receive free slots for a specific day
router.get('/date/:date', async (req: Request, res: Response) => {
  const { date } = req.params;

  if (!date) {
    sendError(res, 400, 'Param `date` is required');

    return;
  }

  try {
    const result = await db.collection('slots').where('date', '==', date).get();

    const slots = result.docs
      .map((doc) => {
        const data = {
          id: doc.id,
          ...doc.data(),
        };
        return SlotSchema.parse(data);
      })
      .filter((data) => data.status === 'free')
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
router.get('/availability/:year/:month', async (req: Request, res: Response) => {
  const { year, month } = req.params;

  if (
    typeof year !== 'string' ||
    typeof month !== 'string' ||
    isYearValid(year) ||
    isMonthValid(month)
  ) {
    sendError(res, 400, 'Params `year` and `month` must be in YYYY/MM format');

    return;
  }

  const now = new Date();
  const isCurrentMonth =
    now.getFullYear() === Number(year) && now.getMonth() + 1 === Number(month);
  const lastDay = new Date(Number(year), Number(month), 0).getDate();
  const from = `${year}-${month}-${isCurrentMonth ? String(now.getDate()).padStart(2, '0') : '01'}`;
  const to = `${year}-${month}-${String(lastDay).padStart(2, '0')}`;

  try {
    const result = await db
      .collection('slots')
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
      .filter((slot) => slot.status === 'free')
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
    const slotDocument = await slotReference.get();

    if (!slotDocument.exists) {
      sendError(res, 404, 'Slot is not defined');

      return;
    }

    const slot = slotDocument.data() as Slot;

    if (slot?.status === 'booked') {
      sendError(res, 409, 'Slot is already booked');

      return;
    }

    await slotReference.update({
      status: 'booked',
      isConfirmed: false,
      massageType: bookingDetails.data.massageType,
      comment: bookingDetails.data.comment || null,
      userId: req.telegramUser.id,
      userName: req.telegramUser.first_name,
      userNickname: req.telegramUser.username ?? null,
    });

    TelegramService.sendAdminNotification(
      `The slot on ${slot.date} was booked by '@${req.telegramUser.username}'`
    );

    TelegramService.sendClientNotification(
      req.telegramUser.id,
      `You succesefully booked the slot on ${slot.date} at ${slot.time}'`
    );

    res.json({ success: true });
  } catch (error) {
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
