const { resolve } = require('node:path')

const project = resolve(process.cwd(), 'tsconfig.json')

/*
https://github.com/vercel/style-guide
 */

/** @type {import("eslint").Linter.Config} */
module.exports = {
    extends: [
        require.resolve("@vercel/style-guide/eslint/next"),
    ],
    parserOptions: {
        project,
    },
    globals: {
        React: true,
        JSX: true,
    },
    env: {
        node: true,
        browser: true,
    },
    plugins: ['only-warn'],
    settings: {
        'import/resolver': {
            typescript: {
                project,
            },
        },
    },
    ignorePatterns: ['.*.js', 'node_modules/', 'dist/'],
    overrides: [{ files: ["*.js?(x)", "*.ts?(x)"] }],
    rules: {
        'import/no-default-export': 'off',
    },
}
