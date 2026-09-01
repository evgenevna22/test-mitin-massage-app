import { NextFunction, Request, Response } from 'express';
import { createHmac } from 'node:crypto';
import { sendError } from '../helpers';
import { config } from '../types/config';

export const verifyTelegram = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (process.env.NODE_ENV === 'development') {
    // temporal for local development
    req.telegramUser = {
      id: config.ADMIN_TELEGRAM_ID,
      first_name: 'Dev',
      username: 'dev_user',
    };
    next();
    return;
  }

  // request must contain a spicific Telegram header to authenticate the user
  const initData = req.headers['x-telegram-init-data'] as string;

  if (!initData) {
    sendError(res, 401, 'There is no user data');

    return;
  }

  const params = new URLSearchParams(initData);
  const hash = params.get('hash');
  const authDate = params.get('auth_date');

  if (!hash) {
    sendError(res, 401, 'hash is empty');

    return;
  }

  if (!authDate) {
    sendError(res, 401, 'authDate is empty');

    return;
  }

  // check that the data is not older than 3600 seconds for security reasons
  const ONE_HOUR_IN_SECONDS = 3600;
  const now = Math.floor(Date.now() / 1000); // текущее время в секундах
  const diff = now - parseInt(authDate);

  if (diff > ONE_HOUR_IN_SECONDS) {
    res.status(401).json({ error: 'initData устарел' });
    return;
  }

  params.delete('hash');

  // there is specific rule to parce a hash and be sure that it's the same user
  const dataString = Array.from(params.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  const secretKey = createHmac('sha256', 'WebAppData')
    .update(config.BOT_TOKEN)
    .digest();

  const expectedHash = createHmac('sha256', secretKey)
    .update(dataString)
    .digest('hex');

  if (expectedHash !== hash) {
    sendError(res, 401, 'There is no user data');
    return;
  }

  req.telegramUser = JSON.parse(params.get('user') ?? '{}');

  next();
};
