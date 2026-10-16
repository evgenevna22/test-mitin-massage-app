import { Request, Response, Router } from 'express';
import { db } from '../../firebase';
import {
  buildSlotId,
  getHourInMs,
  getMinInMs,
  isMonthValid,
  isYearValid,
  sendError,
} from '../../helpers';
import {
  SlotPayloadSchema,
  Slot,
  SlotSchema,
  type DateSlot,
  type TimeSlot,
} from '../../types';
import { verifyMaster } from '../../middleware/verify-master';
import { verifyTelegram } from '../../middleware/verify-telegram';
import type { DocumentReference } from 'firebase-admin/firestore';

const router = Router();

router.use(verifyTelegram);
router.use(verifyMaster);

type MonthDatesFilter = 'working' | 'booked';

const getMonthDates =
  (filter: MonthDatesFilter) => async (req: Request, res: Response) => {
    const { year, month } = req.params;
    const masterId = String(req.telegramUser.id);

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

    const lastDay = new Date(Number(year), Number(month), 0).getDate();
    const from = `${year}-${month}-01`;
    const to = `${year}-${month}-${String(lastDay).padStart(2, '0')}`;

    try {
      let query = db
        .collection('slots')
        .where('masterId', '==', masterId)
        .where('date', '>=', from)
        .where('date', '<=', to);

      if (filter === 'booked') {
        query = query.where('status', '==', 'booked');
      }

      const result = await query.get();

      const slots: Slot[] = result.docs.map((doc) =>
        SlotSchema.parse({ id: doc.id, ...doc.data() })
      );
      const dates = [...new Set(slots.map((slot) => slot.date))].sort();

      res.json(dates);
    } catch (error) {
      console.error('Failed to retrieve master calendar dates:', error);

      sendError(res, 500, 'Failed to retrieve master calendar dates');
    }
  };

// api to receive slots for a specific month
router.get('/working-dates/:year/:month', getMonthDates('working'));

// api to receive booked slots for a specific month
router.get('/booked-dates/:year/:month', getMonthDates('booked'));

// api to receive all master slots for a specific month
router.get('/slots/:year/:month', async (req: Request, res: Response) => {
  const { year, month } = req.params;
  const masterId = String(req.telegramUser.id);

  if (
    typeof year !== 'string' ||
    typeof month !== 'string' ||
    !isYearValid(year) ||
    !isMonthValid(month)
  ) {
    sendError(res, 400, 'Params `year` and `month` must be in YYYY/MM format');

    return;
  }

  const lastDay = new Date(Number(year), Number(month), 0).getDate();
  const from = `${year}-${month}-01`;
  const to = `${year}-${month}-${String(lastDay).padStart(2, '0')}`;

  try {
    const result = await db
      .collection('slots')
      .where('masterId', '==', masterId)
      .where('date', '>=', from)
      .where('date', '<=', to)
      .get();

    const slots: Slot[] = result.docs.map((doc) =>
      SlotSchema.parse({ id: doc.id, ...doc.data() })
    );

    res.json(slots);
  } catch (error) {
    console.error('Failed to retrieve master slots:', error);

    sendError(res, 500, 'Failed to retrieve master slots');
  }
});

// api to receive 10 upcoming booked slots
router.get('/upcoming', async (req: Request, res: Response) => {
  const masterId = String(req.telegramUser.id);
  const today = new Date();
  const transformDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  try {
    const result = await db
      .collection('slots')
      .where('masterId', '==', masterId)
      .where('status', '==', 'booked')
      .where('date', '>=', transformDate(today))
      .orderBy('date')
      .orderBy('time')
      .limit(10)
      .get();

    const slots: Slot[] = result.docs.map((doc) => {
      const data = {
        id: doc.id,
        ...doc.data(),
      };
      return SlotSchema.parse(data);
    });

    res.json(slots);
  } catch (error) {
    console.error('The error while receiving slots:', error);

    sendError(res, 500, 'Failed to receive slots');
  }
});

// api to create slots for a specific dates
router.post('/slots', async (req: Request, res: Response) => {
  const masterId = String(req.telegramUser.id);
  const slots = SlotPayloadSchema.parse(req.body);

  const { dates, time } = slots;

  const createTimeSlots = (date: DateSlot): TimeSlot[] => {
    const DEFAULT_DURATION_IN_HOUR = 1;
    const DEFAULT_GAP_IN_MINS = 30;

    const DEFAULT_DURATION_IN_MS = getHourInMs(DEFAULT_DURATION_IN_HOUR);
    const DEFAULT_GAP_IN_MS = getMinInMs(DEFAULT_GAP_IN_MINS);

    const [year, month, day] = date.split('-');

    const [startHour, startMin] = time.start.split(':').map(Number);
    const [endHour, endMin] = time.end.split(':').map(Number);

    const dateSlot = new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      startHour,
      startMin
    );

    const timeSlots: TimeSlot[] = [time.start];

    for (
      let slot = { hour: startHour, min: startMin };
      slot.hour < endHour || (slot.hour === endHour && slot.min <= endMin);
    ) {
      const diffMs =
        dateSlot.getTime() + DEFAULT_DURATION_IN_MS + DEFAULT_GAP_IN_MS;

      dateSlot.setTime(diffMs);
      slot = {
        hour: dateSlot.getHours(),
        min: dateSlot.getMinutes(),
      };

      if (slot.hour > endHour) {
        break;
      }

      timeSlots.push(
        `${slot.hour.toString().padStart(2, '0')}:${slot.min.toString().padStart(2, '0')}`
      );
    }

    return timeSlots;
  };

  try {
    const slotWrites: Array<{
      ref: DocumentReference;
      data: Omit<Slot, 'id'>;
    }> = [];

    for (const date of dates) {
      for (const time of createTimeSlots(date)) {
        const ref = db.collection('slots').doc(buildSlotId(masterId, date, time));
        slotWrites.push({
          ref,
          data: {
            masterId,
            date,
            time,
            status: 'free',
            isConfirmed: false,
            massageType: '',
            userId: null,
            userName: null,
            userNickname: null,
          },
        });
      }
    }

    await db.runTransaction(async (transaction) => {
      const existingDocuments = await transaction.getAll(
        ...slotWrites.map(({ ref }) => ref)
      );

      existingDocuments.forEach((document, index) => {
        if (!document.exists) {
          transaction.create(slotWrites[index].ref, slotWrites[index].data);
        }
      });
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Failed to save slots:', error);

    sendError(res, 500, 'Failed to save slots');
  }
});

export default router;
