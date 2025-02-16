const ScriptsMap = {
    'express-bun-dev': {
        name: 'start',
        script: 'tsup --watch --onSuccess "bun dist/index.js"',
    },
    'express-bun-start': {
        name: 'dev',
        script: 'bun dist/index.js',
    },
    'express-node-dev': {
        name: 'start',
        script: 'tsup --watch --onSuccess "node dist/index.js"',
    },
    'express-node-start': {
        name: 'dev',
        script: 'node dist/index.js',
    },
} as const

export { ScriptsMap }

export type Scripts = keyof typeof ScriptsMap
