import { Response } from 'express'

export const sendError = (
  res: Response,
  errorCode: number,
  errorMessage: string
) => res.status(errorCode).json({ error: errorMessage })
