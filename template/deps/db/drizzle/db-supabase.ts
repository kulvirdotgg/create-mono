import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { config } from 'dotenv'

import * as schema from '@/drizzle/schema'

config({ path: '.env' })

/*
    Supabase supports connection pooling too. Read more about using below link
    https://supabase.com/docs/guides/database/connecting-to-postgres#connecting-with-prisma
*/

const dbUrl = process.env.DATABASE_URL!

const conn = postgres(dbUrl)
const db = drizzle(conn, { schema })

export { db }
