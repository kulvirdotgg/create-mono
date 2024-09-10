import { defineConfig } from 'drizzle-kit'
import { config } from 'dotenv'

config({ path: '.env' })

const dbUrl = process.env.DATABASE_URL!

export default defineConfig({
    schema: './src/drizzle/schema.ts',
    out: './migrations',
    dialect: 'postgresql',
    dbCredentials: {
        url: dbUrl
    },
    tablesFilter: ['mono_express_*'],
})
