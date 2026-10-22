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
  Slot,
  type DateSlot,
  type SlotPayload,
  type TimeSlot,
} from '../../types';
import { verifyMaster } from '../../middleware/verify-master';
import { verifyTelegram } from '../../middleware/verify-telegram';
import type { DocumentReference } from 'firebase-admin/firestore';
import { ZodError } from 'zod';
import {
  ReschedulePayloadSchema,
  SlotPayloadSchema,
  SlotSchema,
} from '../../schemas';
import { TelegramService } from '../../telegram';

const router = Router();

router.use(verifyTelegram);
router.use(verifyMaster);

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

// api to reschedule slot
router.post('/slots/reschedule', async (req: Request, res: Response) => {
  const parsed = ReschedulePayloadSchema.safeParse(req.body);
  if (!parsed.success) {
    sendError(
      res,
      400,
      parsed.error.issues[0]?.message ?? 'Invalid reschedule data'
    );
    return;
  }

  const { sourceSlotId, targetSlotId, comment } = parsed.data;

  if (sourceSlotId === targetSlotId) {
    sendError(res, 400, 'Source and target slots must be different');
    return;
  }

  const masterId = String(req.telegramUser.id);
  const sourceRef = db.collection('slots').doc(sourceSlotId);
  const targetRef = db.collection('slots').doc(targetSlotId);

  try {
    const movedBooking = await db.runTransaction(async (transaction) => {
      const [sourceDoc, targetDoc] = await transaction.getAll(
        sourceRef,
        targetRef
      );

      if (!sourceDoc.exists || !targetDoc.exists) {
        throw Object.assign(new Error('Slot is not defined'), { status: 404 });
      }

      const source = SlotSchema.parse({
        id: sourceDoc.id,
        ...sourceDoc.data(),
      });

      const target = SlotSchema.parse({
        id: targetDoc.id,
        ...targetDoc.data(),
      });

      if (source.masterId !== masterId || target.masterId !== masterId) {
        throw Object.assign(new Error('Slot is not defined'), { status: 404 });
      }

      if (source.status !== 'booked') {
        throw Object.assign(new Error('Booking is no longer available'), {
          status: 409,
        });
      }

      if (target.status !== 'free') {
        throw Object.assign(new Error('Target slot is no longer free'), {
          status: 409,
        });
      }

      transaction.update(targetRef, {
        status: 'booked',
        isConfirmed: source.isConfirmed,
        comment: comment.trim() || null,
        massageType: source.massageType,
        userId: source.userId,
        userName: source.userName,
        userNickname: source.userNickname,
      });

      transaction.update(sourceRef, {
        status: 'free',
        isConfirmed: false,
        comment: null,
        massageType: '',
        userId: null,
        userName: null,
        userNickname: null,
      });

      return {
        ...source,
        date: target.date,
        time: target.time,
        comment: comment.trim() || null,
      };
    });

    if (movedBooking.userId) {
      void TelegramService.sendClientNotification(
        movedBooking.userId,
        `Your booking was rescheduled to ${movedBooking.date} at ${movedBooking.time}.`
      ).catch((error: ZodError) =>
        console.error('Failed to notify client about reschedule:', error)
      );
    }

    res.json({ success: true });
  } catch (error) {
    if (
      error instanceof Error &&
      'status' in error &&
      (error.status === 404 || error.status === 409)
    ) {
      sendError(res, error.status, error.message);
      return;
    }
    sendError(res, 500, 'Failed to reschedule booking');
  }
});

// api to receive slots for a specific month
router.get('/calendar-dates/:year/:month', getMonthOccupancy);

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
  let slots: SlotPayload;

  try {
    slots = SlotPayloadSchema.parse(req.body);
  } catch (error) {
    if (error instanceof ZodError) {
      sendError(res, 400, error.issues[0]?.message ?? 'Invalid slot data');
      return;
    }

    sendError(res, 400, 'Invalid slot data');
    return;
  }

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
        const ref = db
          .collection('slots')
          .doc(buildSlotId(masterId, date, time));
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
