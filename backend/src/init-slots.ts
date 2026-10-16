import 'dotenv/config';
import { db } from './firebase';
import { buildSlotId } from './helpers';
import { config } from './types/config';

/**
 * Temporal function to fill the database with time slots
 */

const dates = ['2026-10-18', '2026-10-29'];
const times = ['16:00', '17:30', '19:00', '20:30'];

const initSlots = async () => {
  const masterId = config.MASTER_TELEGRAM_IDS[0];

  for (const date of dates) {
    for (const time of times) {
      await db.collection('slots').doc(buildSlotId(masterId, date, time)).create({
        masterId,
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
  process.exit(0);
};

initSlots();
