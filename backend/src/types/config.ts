import { z } from 'zod';

const EnvSchema = z
  .object({
    BOT_TOKEN: z.string().min(1),
    PORT: z.string().default('2222'),
    MASTER_TELEGRAM_IDS: z.string().optional(),
    MASTER_TELEGRAM_ID: z.coerce.number().optional(),
    DEV_TELEGRAM_USER_ID: z.string().optional(),
    NODE_ENV: z.string().min(1),
    FIREBASE_PROJECT_ID: z.string(),
    FIREBASE_CLIENT_EMAIL: z.string(),
    FIREBASE_PRIVATE_KEY: z.string(),
  })
  .transform((env) => {
    const masterTelegramIds = env.MASTER_TELEGRAM_IDS
      ? Array.from(
          new Set(
            env.MASTER_TELEGRAM_IDS.split(',')
              .map((id) => id.trim())
              .filter(Boolean)
          )
        )
      : env.MASTER_TELEGRAM_ID === undefined
        ? []
        : [String(env.MASTER_TELEGRAM_ID)];

    return {
      ...env,
      MASTER_TELEGRAM_IDS: masterTelegramIds,
    };
  })
  .refine((env) => env.MASTER_TELEGRAM_IDS.length > 0, {
    message: 'Set MASTER_TELEGRAM_IDS or legacy MASTER_TELEGRAM_ID',
    path: ['MASTER_TELEGRAM_IDS'],
  })
  .refine((env) => env.MASTER_TELEGRAM_IDS.every((id) => /^\d+$/.test(id)), {
    message: 'Master Telegram IDs must be numeric IDs separated by commas',
    path: ['MASTER_TELEGRAM_IDS'],
  });

export const config = EnvSchema.parse(process.env);
