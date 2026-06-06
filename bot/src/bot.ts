import TelegramBot from 'node-telegram-bot-api'

import { config } from './config';

export const bot = new TelegramBot(config.BOT_TOKEN, { polling: true })

bot.onText(/\/start/, (message) => {
  const chatId = message.chat.id

  bot.sendMessage(chatId, 'Welcome to mitin massage! Book an appointment', {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Book',
            web_app: { url: 'https://ruby-daughter-antirust.ngrok-free.dev' },
          },
        ],
      ],
    },
  })
})
