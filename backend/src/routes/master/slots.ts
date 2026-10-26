import { Request, Response, Router } from 'express';
import { db } from '../../firebase';
import { buildSlotId, sendError } from '../../helpers';
import type { Booking, Slot, SlotPayload } from '../../types';
import { ZodError } from 'zod';
import {
  ManualBookingPayloadSchema,
  ReschedulePayloadSchema,
  SlotPayloadSchema,
  SlotSchema,
} from '../../schemas';
import { TelegramService } from '../../telegram';
import { buildSlotWrites, saveSlotWrites } from '../../services/master-slots';

const router = Router();

// Moves a booking from one existing slot to another free slot.
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

// Deletes one of the authenticated master's slots, including its booking.
router.delete('/slots/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  if (typeof id !== 'string' || !id) {
    sendError(res, 400, 'Param `id` must be a string type');
    return;
  }

  const masterId = String(req.telegramUser.id);
  const slotReference = db.collection('slots').doc(id);

  try {
    const result = await db.runTransaction(async (transaction) => {
      const slotDocument = await transaction.get(slotReference);

      if (!slotDocument.exists) {
        return {
          success: false as const,
          status: 404 as const,
          message: 'Slot is not defined',
        };
      }

      const slot = SlotSchema.parse({
        id: slotDocument.id,
        ...slotDocument.data(),
      });

      if (slot.masterId !== masterId) {
        return {
          success: false as const,
          status: 404 as const,
          message: 'Slot is not defined',
        };
      }

      transaction.delete(slotReference);
      return {
        success: true as const,
        slot,
      };
    });

    if (!result.success) {
      sendError(res, result.status, result.message);
      return;
    }

    if (result.slot.status === 'booked' && result.slot.userId) {
      const username = result.slot.userNickname
        ? `@${result.slot.userNickname}`
        : (result.slot.userName ?? 'client');
        
      const notifications = await Promise.allSettled([
        TelegramService.sendMasterNotification(
          masterId,
          `Booking for ${username} on ${result.slot.date} at ${result.slot.time} was deleted.`
        ),
        TelegramService.sendClientNotification(
          result.slot.userId,
          `Your booking on ${result.slot.date} at ${result.slot.time} was cancelled by the master.`
        ),
      ]);

      notifications.forEach((notification) => {
        if (notification.status === 'rejected') {
          console.error(
            'Failed to send slot deletion notification:',
            notification.reason
          );
        }
      });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Failed to delete slot:', error);
    sendError(res, 500, 'Failed to delete slot');
  }
});

type ManualBookingTransactionResult =
  | { success: false; status: 404 | 409; message: string }
  | { success: true; slot: Slot };

// Books an existing free slot for a client entered by the master.
router.post('/slots/manual-booking', async (req: Request, res: Response) => {
  const parsed = ManualBookingPayloadSchema.safeParse(req.body);
  if (!parsed.success) {
    sendError(
      res,
      400,
      parsed.error.issues[0]?.message ?? 'Invalid booking data'
    );
    return;
  }

  const masterId = String(req.telegramUser.id);
  const { date, time, userId, userName, massageType, comment } = parsed.data;
  const slotRef = db.collection('slots').doc(buildSlotId(masterId, date, time));

  try {
    const result = await db.runTransaction(
      async (transaction): Promise<ManualBookingTransactionResult> => {
        const document = await transaction.get(slotRef);

        if (!document.exists) {
          return {
            success: false,
            status: 404,
            message: 'Slot is not defined',
          };
        }

        const slot = SlotSchema.parse({
          id: document.id,
          ...document.data(),
        });

        if (slot.masterId !== masterId) {
          return {
            success: false,
            status: 404,
            message: 'Slot is not defined',
          };
        }

        if (slot.status !== 'free') {
          return {
            success: false,
            status: 409,
            message: 'Slot is no longer available',
          };
        }

        const booking: Booking = {
          status: 'booked',
          isConfirmed: false,
          massageType,
          comment: comment?.trim() || null,
          userId,
          userName,
          userNickname: null,
        };

        transaction.update(slotRef, booking);

        return { success: true, slot: { ...slot, ...booking } };
      }
    );

    if (!result.success) {
      sendError(res, result.status, result.message);
      return;
    }

    const notifications = await Promise.allSettled([
      TelegramService.sendClientNotification(
        userId,
        `A massage appointment has been booked for ${date} at ${time}.`
      ),
      TelegramService.sendMasterNotification(
        masterId,
        `Manual booking created for Telegram user @${userName} on ${date} at ${time}.`
      ),
    ]);

    notifications.forEach((notification) => {
      if (notification.status === 'rejected') {
        console.error(
          'Failed to send manual booking notification:',
          notification.reason
        );
      }
    });

    res.json({ success: true, slot: result.slot });
  } catch (error) {
    console.error('Failed to create manual booking:', error);
    sendError(res, 500, 'Failed to create manual booking');
  }
});

// Creates slots for the requested dates after validating the complete candidate set.
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

  try {
    const slotWrites = buildSlotWrites(masterId, slots.dates, slots.time);
    const conflict = await saveSlotWrites(masterId, slotWrites);

    if (conflict) {
      sendError(
        res,
        409,
        `Slot at ${conflict.candidate} on ${conflict.date} is too close to ${conflict.conflictingTime}. Slots must be at least 90 minutes apart.`
      );
      return;
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Failed to save slots:', error);
    sendError(res, 500, 'Failed to save slots');
  }
});

export default router;
