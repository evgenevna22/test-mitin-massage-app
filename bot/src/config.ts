import { z } from 'zod'

const EnvSchema = z.object({
  BOT_TOKEN: z.string().min(1),
  PORT: z.string().default('2222'),
  MASTER_TELEGRAM_ID: z.coerce.number(),
  ADMIN_TELEGRAM_ID: z.coerce.number(),
  NODE_ENV: z.string().min(1),
  FIREBASE_PROJECT_ID: z.string(),
  FIREBASE_CLIENT_EMAIL: z.string(),
  FIREBASE_PRIVATE_KEY: z.string(),
})

export const config = EnvSchema.parse(process.env)
