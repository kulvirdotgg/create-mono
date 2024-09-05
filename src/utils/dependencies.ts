/*
    Earlier I was gonna put dependencies in the files they are requires...
    but Theo's t3 did it this way.... Kinda easy to manintain.. 
    Thanks again Theo, if you see stuff copied T3 code then it is actually. (Opensource BTW)
*/
const dependencyMap = {
    // Drizzle
    'drizzle-orm': '^0.33.0',
    '@neondatabase/serverless': '^0.9.4',
    postgres: '^3.4.4',
    'drizzle-kit': '^0.24.2',

    // Prisma
    '@prisma/client': '^5.19.1',
    '@prisma/adapter-neon': '^5.19.1',
    prisma: '^5.19.1',

    // TailwindCSS
    postcss: '^8.4.44',
    prettier: '^3.3.3',
    tailwindcss: '^3.4.10',
    // 'prettier-plugin-tailwindcss': '^0.6.6',
} as const

type TDependencies = keyof typeof dependencyMap

export { dependencyMap, TDependencies }
