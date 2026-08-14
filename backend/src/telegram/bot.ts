import TelegramBot from 'node-telegram-bot-api'

import { config } from '../config';

export const bot = new TelegramBot(config.BOT_TOKEN, { polling: config.NODE_ENV !== 'development' })

