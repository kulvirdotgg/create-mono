import { config } from 'dotenv'
import { z } from 'zod'

config()

const envSchema = z.object({
    TURSO_DATABASE_URL: z.string(),
    TURSO_AUTH_TOKEN: z.string(),
})

export const env = envSchema.parse(process.env)
