export const ScriptsMap = {
    'express-bun-dev': {
        name: 'dev',
        script: 'tsup --watch --onSuccess "bun dist/index.js"',
    },
    'express-bun-start': {
        name: 'start',
        script: 'bun dist/index.js',
    },
    'express-node-dev': {
        name: 'dev',
        script: 'tsup --watch --onSuccess "node dist/index.js"',
    },
    'express-node-start': {
        name: 'start',
        script: 'node dist/index.js',
    },
    'drizzle-generate': {
        name: 'db:generate',
        script: 'drizzle-kit generate',
    },
    'drizzle-migrate': {
        name: 'db:migrate',
        script: 'drizzle-kit migrate',
    },
    'drizzle-studio': {
        name: 'db:studio',
        script: 'drizzle-kit studio',
    },
    'prisma-generate': {
        name: 'db:generate',
        script: 'prisma generate',
    },
    'prisma-migrate': {
        name: 'db:migrate:dev',
        script: 'prisma migrate dev',
    },
    'prisma-studio': {
        name: 'db:studio',
        script: 'prsma studio',
    },
    'prisma-format': {
        name: 'format',
        script: 'prisma format',
    },
} as const

export type TScripts = keyof typeof ScriptsMap

export const ExportsMap = {
    'drizzle-db': {
        name: '.',
        exp: './src/index.ts',
    },
    'drizzle-schema': {
        name: './schema',
        exp: './src/db/schema.ts',
    },
} as const

export type TExports = keyof typeof ExportsMap
