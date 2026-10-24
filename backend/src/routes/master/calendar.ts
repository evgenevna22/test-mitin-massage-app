import { Request, Response, Router } from 'express';
import { db } from '../../firebase';
import { isMonthValid, isYearValid, sendError } from '../../helpers';
import type { Slot } from '../../types';
import { SlotSchema } from '../../schemas';

const router = Router();

const getMonthOccupancy = async (req: Request, res: Response) => {
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
    const monthOccupancy = {
      workingDates: new Set<string>(),
      bookedDates: new Set<string>(),
      datesWithFreeSlots: new Set<string>(),
    };

    for (const slot of slots) {
      monthOccupancy.workingDates.add(slot.date);
      if (slot.status === 'booked') {
        monthOccupancy.bookedDates.add(slot.date);
      } else {
        monthOccupancy.datesWithFreeSlots.add(slot.date);
      }
    }

    res.json({
      workingDates: [...monthOccupancy.workingDates].sort(),
      bookedDates: [...monthOccupancy.bookedDates].sort(),
      datesWithFreeSlots: [...monthOccupancy.datesWithFreeSlots].sort(),
    });
  } catch (error) {
    console.error('Failed to retrieve master calendar slots:', error);
    sendError(res, 500, 'Failed to retrieve master calendar slots');
  }
};

// Returns all slots for the requested month.
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

// Returns the master's ten next booked slots.
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

    const slots: Slot[] = result.docs.map((doc) =>
      SlotSchema.parse({ id: doc.id, ...doc.data() })
    );

    res.json(slots);
  } catch (error) {
    console.error('The error while receiving slots:', error);
    sendError(res, 500, 'Failed to receive slots');
  }
});

router.get('/calendar-dates/:year/:month', getMonthOccupancy);

export default router;
