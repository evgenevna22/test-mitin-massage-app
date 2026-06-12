import { NextFunction, Request, Response } from 'express'
import { sendError } from '../helpers'
import { config } from '../config'

export const verifyAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (config.NODE_ENV === 'development') {
    // это не нужно, когда буду именно октрывать в мини апке
    req.telegramUser = {
      id: 123456,
      first_name: 'Dev',
      username: 'dev_user',
    }
    next()
    return
  }

  const initData = req.headers['x-telegram-init-data'] as string

  if (!initData) {
    sendError(res, 401, 'initData is empty')

    return
  }

  const { id } = req.telegramUser

  if (config.MASTER_TELEGRAM_ID !== id.toString()) {
    sendError(res, 403, "You don't have permissions to go there.")
    return
  }

  next()
}
