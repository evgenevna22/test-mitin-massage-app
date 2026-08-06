import { config } from '../config'
import { bot } from './bot'

export class TelegramService {
  static sendAdminNotification = async (text: string) => {
    return bot.sendMessage(config.MASTER_TELEGRAM_ID, text)
  }

  static sendClientNotification = async (id: number, text: string) => {
    return bot.sendMessage(id, text)
  }
}

