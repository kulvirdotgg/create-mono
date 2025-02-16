import { defineConfig } from 'drizzle-kit'

import { env } from './src/env'

export default defineConfig({
    schema: './src/db',
    out: './migrations',
    dialect: 'turso',
    dbCredentials: {
        url: env.TURSO_DATABASE_URL,
        authToken: env.TURSO_AUTH_TOKEN,
    },
})
