import { env } from './src/env'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
    schema: './src/db',
    out: './migrations',
    dialect: 'sqlite',
    dbCredentials: {
        url: env.DATABASE_FILE_NAME,
    },
})
