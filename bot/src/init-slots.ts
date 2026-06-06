import { db } from './firebase';

const dates = ['2026-06-10', '2026-06-11', '2026-06-12'];
const times = ['10:00', '11:00', '12:00', '14:00', '15:00', '16:00'];

async function initSlots() {
  for (const date of dates) {
    for (const time of times) {
      await db.collection('slots').add({
        date,
        time,
        status: 'free',
        userId: null,
        userName: null,
        userNickname: null
      });
      console.log(`Создан слот: ${date} ${time}`);
    }
  }
  console.log('Готово!');
  process.exit(0);
}

initSlots();