import { defineConfig } from 'drizzle-kit'

import { env } from './src/env'

export default defineConfig({
    schema: './src/db',
    out: './migrations',
    dialect: 'postgresql',
    dbCredentials: {
        url: env.DATABASE_URL,
    },
})
