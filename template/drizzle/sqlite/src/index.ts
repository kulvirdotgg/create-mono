import { drizzle } from 'drizzle-orm/libsql'

import * as schema from './db/schema'
import { env } from './env'

const db = drizzle(env.DATABASE_FILE_NAME, { schema })

export { db }
