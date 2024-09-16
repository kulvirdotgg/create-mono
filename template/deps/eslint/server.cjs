const { resolve } = require('node:path')

const project = resolve(process.cwd(), 'tsconfig.json')

/*
https://github.com/vercel/style-guide
*/

/** @type {import("eslint").Linter.Config} */
module.exports = {
    extends: ["eslint:recommended", "prettier", "turbo"],
    plugins: ['only-warn'],
    parserOptions: {
        project,
    },
    env: {
        node: true,
        es6: true,
    },
    settings: {
        'import/resolver': {
            typescript: {
                project,
            },
        },
    },
    overrides: [],
    ignorePatterns: ['.*.js', 'node_modules/', 'dist/'],
    rules: {
        'import/no-default-export': 'off',
    },
}
