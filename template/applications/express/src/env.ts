import { config } from 'dotenv'
import { z } from 'zod'

config()

// NOTE: Add ENV variable here too after adding to .env
const envSchema = z.object({
    NODE_ENV: z
        .enum(['development', 'test', 'production'])
        .default('development'),

    PORT: z.coerce.number().min(1000),
})

export const env = envSchema.parse(process.env)
