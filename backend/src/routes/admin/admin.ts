import { Request, Response, Router } from 'express';
import { db } from '../../firebase';
import {
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
import { verifyAdmin } from '../../middleware/verify-admin';
import { verifyTelegram } from '../../middleware/verify-telegram';

const router = Router();

router.use(verifyTelegram);
router.use(verifyAdmin);

type MonthDatesFilter = 'working' | 'booked';

const getMonthDates =
  (filter: MonthDatesFilter) => async (req: Request, res: Response) => {
    const { year, month } = req.params;

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
      const result = await db
        .collection('slots')
        .where('date', '>=', from)
        .where('date', '<=', to)
        .get();

      const slots: Slot[] = result.docs.map((doc) =>
        SlotSchema.parse({ id: doc.id, ...doc.data() })
      );
      const filteredSlots =
        filter === 'booked'
          ? slots.filter((slot) => slot.status === 'booked')
          : slots;
      const dates = [...new Set(filteredSlots.map((slot) => slot.date))].sort();

      res.json(dates);
    } catch (error) {
      console.error('Failed to retrieve admin calendar dates:', error);

      sendError(res, 500, 'Failed to retrieve admin calendar dates');
    }
  };

// api to receive slots for a specific month
router.get('/working-dates/:year/:month', getMonthDates('working'));

// api to receive booked slots for a specific month
router.get('/booked-dates/:year/:month', getMonthDates('booked'));

// api to receive all master slots for a specific month
router.get('/slots/:year/:month', async (req: Request, res: Response) => {
  const { year, month } = req.params;

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
    console.error('The error while recieving slots:', error);

    sendError(res, 500, 'Failed to receive clots');
  }
});

// api to create slots for a specific dates
router.post('/slots', async (req: Request, res: Response) => {
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

      timeSlots.push(`${slot.hour}:${slot.min.toString().padStart(2, '0')}`);
    }

    return timeSlots;
  };

  try {
    const batch = db.batch();

    for (const date of dates) {
      for (const time of createTimeSlots(date)) {
        const ref = db.collection('slots').doc();
        batch.set(ref, {
          date,
          time,
          status: 'free',
          isConfirmed: false,
          massageType: '',
          userId: null,
          userName: null,
          userNickname: null,
        });
      }
    }

    await batch.commit();

    res.json({ success: true });
  } catch (error) {
    console.error('Failes to save slots:', error);

    sendError(res, 500, 'Failes to save slots');
  }
});

export default router;
