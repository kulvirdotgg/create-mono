const { resolve } = require('node:path')

const project = resolve(process.cwd(), 'tsconfig.json')

/** @type {import("eslint").Linter.Config} */
module.exports = {
    extends: ['eslint:recommended', 'prettier', 'turbo'],
    plugins: ['only-warn'],
    globals: {
        JSX: true,
        React: true,
    },
    env: {
        browser: true,
    },
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
    ignorePatterns: ['node_modules/', 'dist/', '.eslintrc.cjs', '**/*.css'],
    overrides: [{ files: ['*.js?(x)', '*.ts?(x)'] }],
    rules: {},
}
