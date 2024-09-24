import { PrismaClient } from '@prisma/client'

/*
    To use Connection Pooling read more on below link
    https://www.prisma.io/docs/orm/overview/databases/postgresql
*/

const prismaClientSingleton = () => {
    return new PrismaClient()
}

/*
    caching connections to avoid multiple connections with HMR in dev env
    https://www.prisma.io/docs/orm/more/help-and-troubleshooting/help-articles/nextjs-prisma-client-dev-practices
*/

declare const globalThis: {
    prismaGlobal: ReturnType<typeof prismaClientSingleton>
} & typeof global

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma

export * from '@prisma/client'
