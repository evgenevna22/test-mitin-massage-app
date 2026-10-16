import { bot } from './bot';

export class TelegramService {
  static sendMasterNotification = async (masterId: string, text: string) => {
    return bot.sendMessage(Number(masterId), text);
  };

  static sendClientNotification = async (id: number, text: string) => {
    return bot.sendMessage(id, text);
  };
}
