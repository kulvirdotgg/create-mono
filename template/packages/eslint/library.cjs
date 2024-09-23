const { resolve } = require('node:path')

const project = resolve(process.cwd(), 'tsconfig.json')

/** @type {import("eslint").Linter.Config} */
module.exports = {
    extends: ['eslint:recommended', 'prettier', 'turbo'],
    plugins: ['only-warn'],
    parserOptions: {
        project,
    },
    settings: {
        'import/resolver': {
            typescript: {
                project,
            },
        },
    },
    ignorePatterns: ['node_modules/', '.*.js', 'dist/'],
    overrides: [{ files: ['*.js', '*.ts'] }],
    rules: {
        'import/no-default-export': 'off',
    },
}
