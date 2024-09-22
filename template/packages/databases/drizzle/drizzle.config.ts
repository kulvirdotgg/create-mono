import { config } from 'dotenv'
import { defineConfig } from 'drizzle-kit'

config({ path: '.env' })

const dbUrl = process.env.DATABASE_URL!

export default defineConfig({
    schema: './src/schema.ts',
    out: './migrations',
    dialect: 'postgresql',
    dbCredentials: {
        url: dbUrl,
    },
    tablesFilter: ['mono_*'],
})
