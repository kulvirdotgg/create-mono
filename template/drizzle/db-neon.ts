import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import { config } from 'dotenv'

import * as schema from '@/schema'

config({ path: '.env' })

/*
    Neon supports connection pooling too. Read more about using below link
    https://neon.tech/docs/connect/connection-pooling
*/

const dbUrl = process.env.DATABASE_URL!

const conn = neon(dbUrl)
const db = drizzle(conn, { schema })

export { db }
