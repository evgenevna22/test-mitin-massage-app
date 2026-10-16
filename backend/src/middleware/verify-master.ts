import { NextFunction, Request, Response } from 'express';
import { sendError } from '../helpers';
import { config } from '../types/config';

export const verifyMaster = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const masterId = String(req.telegramUser.id);

  if (!config.MASTER_TELEGRAM_IDS.includes(masterId)) {
    sendError(res, 403, "You don't have permissions to manage this schedule.");
    return;
  }

  next();
};
