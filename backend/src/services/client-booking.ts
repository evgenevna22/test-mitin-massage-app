import { db } from '../firebase';
import { SlotSchema } from '../schemas';
import type { Slot } from '../types';

export type CancelBookingResult =
  | {
      success: false;
      status: 404 | 403 | 409;
      message: string;
    }
  | {
      success: true;
      slot: Slot;
    };

// Cancels a client's booking after checking its owner in the same transaction.
export const cancelClientBooking = async (
  slotId: string,
  clientId: number
): Promise<CancelBookingResult> => {
  const slotReference = db.collection('slots').doc(slotId);

  return db.runTransaction(async (transaction) => {
    const slotDocument = await transaction.get(slotReference);

    if (!slotDocument.exists) {
      return {
        success: false,
        status: 404,
        message: 'Slot is not defined',
      };
    }

    const slot = SlotSchema.parse({
      id: slotDocument.id,
      ...slotDocument.data(),
    });

    if (slot.status === 'free') {
      return {
        success: false,
        status: 409,
        message: 'Slot is already free',
      };
    }

    if (slot.userId !== clientId) {
      return {
        success: false,
        status: 403,
        message: "Cancelling someone else's appointment is forbidden",
      };
    }

    transaction.update(slotReference, {
      status: 'free',
      isConfirmed: false,
      massageType: '',
      comment: null,
      userId: null,
      userName: null,
      userNickname: null,
    });

    return {
      success: true,
      slot,
    };
  });
};
