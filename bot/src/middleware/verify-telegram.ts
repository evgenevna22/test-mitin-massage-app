import { NextFunction, Request, Response } from 'express'
import { createHmac } from 'node:crypto'
import { sendError } from '../helpers'
import { config } from '../config'

export const verifyTelegram = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (process.env.NODE_ENV === 'development') {
    req.telegramUser = {
      id: 1,
      first_name: 'Dev',
      username: 'dev_user',
    }
    next()
    return
  }

  // Фронт будет присылать initData в заголовке запроса
  const initData = req.headers['x-telegram-init-data'] as string

  if (!initData) {
    sendError(res, 401, 'initData is empty')

    return
  }

  const params = new URLSearchParams(initData)
  const hash = params.get('hash')
  const authDate = params.get('auth_date')

  if (!hash) {
    sendError(res, 401, 'hash is empty')

    return
  }

  if (!authDate) {
    sendError(res, 401, 'authDate is empty')

    return
  }

  // Проверяем что данные не старше 1 часа (3600 секунд)
  const ONE_HOUR_IN_SECONDS = 3600
  const now = Math.floor(Date.now() / 1000) // текущее время в секундах
  const diff = now - parseInt(authDate)

  if (diff > ONE_HOUR_IN_SECONDS) {
    res.status(401).json({ error: 'initData устарел' })
    return
  }

  params.delete('hash')

  // Сортируем оставшиеся параметры и склеиваем через \n
  const dataString = Array.from(params.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n')

  // Создаём секретный ключ из BOT_TOKEN
  const secretKey = createHmac('sha256', 'WebAppData')
    .update(config.BOT_TOKEN)
    .digest()

  // Подписываем данные секретным ключом
  const expectedHash = createHmac('sha256', secretKey)
    .update(dataString)
    .digest('hex')

  // Сравниваем нашу подпись с той, что прислал фронт
  if (expectedHash !== hash) {
    sendError(res, 401, 'Signature does not match')
    return
  }

  req.telegramUser = JSON.parse(params.get('user') ?? '{}')

  next()
}
