import { drizzle } from 'drizzle-orm/node-postgres'

import { env } from './env'
import * as schema from './db/schema'

const db = drizzle(env.DATABASE_URL, { schema })

export { db }
