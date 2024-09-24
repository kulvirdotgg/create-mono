/*
    Earlier I was gonna put dependencies in the files they are requires...
    but Theo's t3 did it this way.... Kinda easy to manintain.. 
    Thanks again Theo, if you see stuff copied T3 code then it is actually. (Opensource BTW)
*/
const dependencyMap = {
    'drizzle-orm': '^0.33.0',
    '@neondatabase/serverless': '^0.9.4',
    postgres: '^3.4.4',
    'drizzle-kit': '^0.24.2',

    '@prisma/client': '^5.19.1',
    '@prisma/adapter-neon': '^5.19.1',
    prisma: '^5.19.1',

    'types/node': '^22.6.1',
    'types/bun': '^1.1.5',
} as const

export type TDependencies = keyof typeof dependencyMap

export { dependencyMap }
