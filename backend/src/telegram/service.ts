import { bot } from './bot';

export class TelegramService {
  static sendMasterNotification = async (masterId: string, text: string) => {
    return bot.sendMessage(Number(masterId), text);
  };

  static sendClientNotification = async (id: number, text: string) => {
    return bot.sendMessage(id, text);
  };

  static sendClientBookingNotification = async (
    id: number,
    slotId: string,
    text: string
  ) => {
    return bot.sendMessage(id, text, {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Cancel booking',
              callback_data: `cancel_booking:${slotId}`,
            },
          ],
        ],
      },
    });
  };
}
