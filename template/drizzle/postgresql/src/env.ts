import { createEnv } from '@repo/utils/env'
import { z } from 'zod'

const envSchema = z.object({
    DATABASE_URL: z.string(),
})

export const env = createEnv(envSchema)
