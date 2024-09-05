import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'

import { env } from '../env'
import * as schema from './schema'

/*
    Supabase supports connection pooling too. Read more about using below link
    https://supabase.com/docs/guides/database/connecting-to-postgres#connecting-with-prisma
*/

const conn = neon(env.DATABASE_URL)
const db = drizzle(conn, { schema })

export { db }
