import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import { env } from '@/env'
import * as schema from '@/drizzle/schema'

/*
    Supabase supports connection pooling too. Read more about using below link
    https://supabase.com/docs/guides/database/connecting-to-postgres#connecting-with-prisma
*/

const conn = postgres(env.DATABASE_URL)
const db = drizzle(conn, { schema })

export { db }
