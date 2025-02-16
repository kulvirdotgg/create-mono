const ScriptsMap = {
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
} as const

export { ScriptsMap }

export type Scripts = keyof typeof ScriptsMap
