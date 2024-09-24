import { neon } from '@neondatabase/serverless'
import { PrismaNeonHTTP } from '@prisma/adapter-neon'
import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'

config({ path: '.env' })

/*
    To use Connection Pooling read more on below link
    https://www.prisma.io/docs/orm/overview/databases/neon
*/

const dbUrl = process.env.DATABASE_URL!

const prismaClientSingleton = () => {
    const postgres = neon(dbUrl)
    const adapter = new PrismaNeonHTTP(postgres)
    return new PrismaClient({ adapter })
}

/*
    caching connections to avoid multiple connections with HMR in dev env
    https://www.prisma.io/docs/orm/more/help-and-troubleshooting/help-articles/nextjs-prisma-client-dev-practices
*/

declare const globalThis: {
    prismaGlobal: ReturnType<typeof prismaClientSingleton>
} & typeof global

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export {prisma}

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma

export * from '@prisma/client'
