import { config } from 'dotenv'
import { z } from 'zod'

/**
 * Creates a type-safe environment variable validator
 * @param schema - Zod schema for environment variables
 * @param envPath - Optional path to .env file. If not provided, loads from current working directory.
 * @returns Validated environment object
 */
export function createEnv<T extends z.ZodTypeAny>(
    schema: T,
    envPath?: string
): z.infer<T> {
    if (envPath) {
        config({ path: envPath })
    } else {
        config()
    }

    return schema.parse(process.env)
}

