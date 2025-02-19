import { PrismaClient, PrismaLibSQL } from '../generated/client'
import { createClient } from '@libsql/client'

const libsql = createClient({
    url: `${process.env.TURSO_DATABASE_URL}`,
    authToken: `${process.env.TURSO_AUTH_TOKEN}`,
})
const adapter = new PrismaLibSQL(libsql)

const globalForDb = global as unknown as { db: PrismaClient }

export const db = globalForDb.db || new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForDb.db = db
