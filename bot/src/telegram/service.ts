import { config } from '../config'
import { bot } from './bot'

export class TelegramService {
  static sendAdminNotification = async (text: string) => {
    return bot.sendMessage(config.ADMIN_TELEGRAM_ID, text) // will be master's ID
  }

  static sendClientNotification = async (id: number, text: string) => {
    return bot.sendMessage(id, text)
  }
}
