import { createEnv } from '@repo/utils/env'
import { z } from 'zod'


const envSchema = z.object({
    TURSO_DATABASE_URL: z.string(),
    TURSO_AUTH_TOKEN: z.string(),
})

export const env = createEnv(envSchema)
