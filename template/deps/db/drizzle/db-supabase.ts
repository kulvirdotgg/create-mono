import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import { env } from '../env'
import * as schema from './schema'

/*
    Neon supports connection pooling too. Read more about using below link
    https://neon.tech/docs/connect/connection-pooling
*/

const conn = postgres(env.DATABASE_URL)
const db = drizzle(conn, { schema })

export { db }
