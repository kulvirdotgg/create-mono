/*
    Thanks Theo, if you see stuff copied T3 code then it is actually. (Opensource BTW)
*/
const dependencyMap = {
    'drizzle-orm': '^0.39.3',
    '@prisma/client': '^6.3.1',
    postgres: '^3.4.5',
} as const

const devDependencyMap = {
    // types
    '@types/node': '^22.13.1',
    '@types/bun': '^1.2.2',

    // drizzle
    'drizzle-kit': '^0.30.4',

    // prisma
    prisma: '^6.3.1',
} as const

export type TDependencies = keyof typeof dependencyMap

export type TDevDependencies = keyof typeof devDependencyMap

export { dependencyMap, devDependencyMap }
