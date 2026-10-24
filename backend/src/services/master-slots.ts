import type { DocumentReference } from 'firebase-admin/firestore';
import { db } from '../firebase';
import {
  buildSlotId,
  getMinutesFromTime,
  getHourInMs,
  getMinInMs,
} from '../helpers';
import type { DateSlot, Slot, SlotPayload, TimeSlot } from '../types';
import { MIN_SLOT_GAP_IN_MINS } from '../consts';

type SlotWrite = {
  ref: DocumentReference;
  data: Omit<Slot, 'id'>;
};

export type SlotConflict = {
  date: string;
  candidate: string;
  conflictingTime: string;
};

const findSlotSpacingConflict = (
  date: string,
  existingTimes: Set<string>,
  candidateTimes: Set<string>
): SlotConflict | null => {
  const allTimes = new Set([...existingTimes, ...candidateTimes]);

  for (const candidate of candidateTimes) {
    if (existingTimes.has(candidate)) {
      continue;
    }

    const candidateMinutes = getMinutesFromTime(candidate);
    for (const existingTime of allTimes) {
      if (existingTime === candidate) {
        continue;
      }

      const gap = Math.abs(candidateMinutes - getMinutesFromTime(existingTime));
      if (gap < MIN_SLOT_GAP_IN_MINS) {
        return {
          date,
          candidate,
          conflictingTime: existingTime,
        };
      }
    }
  }

  return null;
};

const createTimeSlots = (
  date: DateSlot,
  timeRange: SlotPayload['time']
): TimeSlot[] => {
  const DEFAULT_DURATION_IN_HOUR = 1;
  const DEFAULT_GAP_IN_MINS = 30;

  const DEFAULT_DURATION_IN_MS = getHourInMs(DEFAULT_DURATION_IN_HOUR);
  const DEFAULT_GAP_IN_MS = getMinInMs(DEFAULT_GAP_IN_MINS);

  const [year, month, day] = date.split('-');
  const [startHour, startMin] = timeRange.start.split(':').map(Number);
  const [endHour, endMin] = timeRange.end.split(':').map(Number);

  const dateSlot = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    startHour,
    startMin
  );

  const timeSlots: TimeSlot[] = [timeRange.start];

  for (
    let slot = { hour: startHour, min: startMin };
    slot.hour < endHour || (slot.hour === endHour && slot.min <= endMin);
  ) {
    const nextSlotTime =
      dateSlot.getTime() + DEFAULT_DURATION_IN_MS + DEFAULT_GAP_IN_MS;

    dateSlot.setTime(nextSlotTime);
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

// Generates the complete, deduplicated set of slot documents for a request.
export const buildSlotWrites = (
  masterId: string,
  dates: DateSlot[],
  timeRange: SlotPayload['time']
): SlotWrite[] => {
  const slotWritesById = new Map<string, SlotWrite>();

  for (const date of dates) {
    for (const time of createTimeSlots(date, timeRange)) {
      const ref = db.collection('slots').doc(buildSlotId(masterId, date, time));

      if (!slotWritesById.has(ref.id)) {
        slotWritesById.set(ref.id, {
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
  }

  return [...slotWritesById.values()];
};

// Checks requested slots against the current schedule and creates missing documents atomically.
export const saveSlotWrites = async (
  masterId: string,
  slotWrites: SlotWrite[]
): Promise<SlotConflict | null> => {
  return db.runTransaction(async (transaction) => {
    const datesToCheck = [...new Set(slotWrites.map(({ data }) => data.date))];
    const dateSnapshots = await Promise.all(
      datesToCheck.map((date) =>
        transaction.get(
          db
            .collection('slots')
            .where('masterId', '==', masterId)
            .where('date', '==', date)
        )
      )
    );
    const existingTimesByDate = new Map<string, Set<string>>();
    const existingSlotIds = new Set<string>();

    dateSnapshots.forEach((snapshot, index) => {
      existingTimesByDate.set(
        datesToCheck[index],
        new Set(snapshot.docs.map((document) => String(document.get('time'))))
      );
      snapshot.docs.forEach((document) => {
        existingSlotIds.add(document.id);
      });
    });

    const candidateTimesByDate = new Map<string, Set<string>>();
    slotWrites.forEach(({ data }) => {
      const candidateTimes = candidateTimesByDate.get(data.date) ?? new Set();
      candidateTimes.add(data.time);
      candidateTimesByDate.set(data.date, candidateTimes);
    });

    for (const [date, candidateTimes] of candidateTimesByDate) {
      const conflict = findSlotSpacingConflict(
        date,
        existingTimesByDate.get(date) ?? new Set(),
        candidateTimes
      );

      if (conflict) {
        return conflict;
      }
    }

    slotWrites.forEach(({ ref, data }) => {
      if (!existingSlotIds.has(ref.id)) {
        transaction.create(ref, data);
      }
    });

    return null;
  });
};
