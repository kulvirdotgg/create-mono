import { createEnv } from '@repo/utils/env'
import { z } from 'zod'


// NOTE: Add ENV variable here too after adding to .env
const envSchema = z.object({
    NODE_ENV: z
        .enum(['development', 'test', 'production'])
        .default('development'),

    PORT: z.coerce.number().min(1000).default(8000),
})

export const env = createEnv(envSchema)
