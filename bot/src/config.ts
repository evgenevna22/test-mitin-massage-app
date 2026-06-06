import { z } from 'zod'

const EnvSchema = z.object({
  BOT_TOKEN: z.string().min(1),
  PORT: z.string().default('2222'),
})

export const config = EnvSchema.parse(process.env);
