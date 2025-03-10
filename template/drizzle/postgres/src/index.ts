import { drizzle } from 'drizzle-orm/postgres-js'

import { env } from './env'
import * as schema from './db/schema'

const db = drizzle(env.DATABASE_URL, { schema })

export { db }
