import { bot } from './bot'

export const registerBotHandlers = () => {
  bot.onText(/\/start/, (message) => {
    const chatId = message.chat.id

    bot.sendMessage(chatId, 'Welcome to mitin massage! Book an appointment', {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Book',
              web_app: { url: 'https://test-mitin-massage-app.vercel.app' },
            },
          ],
        ],
      },
    })
  })
}
