import { env } from './src/env'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
    schema: './src/db',
    out: './migrations',
    dialect: 'postgresql',
    dbCredentials: {
        url: env.DATABASE_URL,
    },
})
