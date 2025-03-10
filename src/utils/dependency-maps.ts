/*
    Thanks Theo, if you see stuff copied T3 code then it is actually. (Opensource BTW)
*/
const dependencyMap = {
    cors: '^2.8.5',
    dotenv: '^16.4.7',
    express: '^5.0.0',
    'drizzle-orm': '^0.40.0',
    '@libsql/client': '^0.14.0',
    morgan: '1.10.0',
    next: '15.2.1',
    '@prisma/client': '^6.4.1',
    pg: '^8.13.3',
    react: '^19.0.0',
    'react-dom': '^19.0.0',
    zod: '^3.24.2',
} as const

const devDependencyMap = {
    // types
    '@types/bun': '^1.2.4',
    '@types/cors': '^2.8.17',
    '@types/express': '^5.0.0',
    '@types/morgan': '^1.9.9',
    '@types/node': '^22.13.4',
    '@types/react': '^19.0.10',
    '@types/react-dom': '^19.0.4',

    'drizzle-kit': '^0.30.5',
    'drizzle-seed': '^0.3.1',
    eslint: '^9.22.0',
    prisma: '^6.4.1',
    tsup: '^8.4.0',
    vite: '^6.2.1',
    '@vitejs/plugin-react': '^4.3.4',
} as const

export type TDependencies = keyof typeof dependencyMap

export type TDevDependencies = keyof typeof devDependencyMap

export { dependencyMap, devDependencyMap }
