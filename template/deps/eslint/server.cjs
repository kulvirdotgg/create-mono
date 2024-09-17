const { resolve } = require('node:path')

const project = resolve(process.cwd(), 'tsconfig.json')

/*
https://github.com/vercel/style-guide
*/

/** @type {import("eslint").Linter.Config} */
module.exports = {
    extends: [
        '@vercel/style-guide/eslint/node',
        '@vercel/style-guide/eslint/typescript',
    ].map(require.resolve),

    parserOptions: {
        project,
    },
    env: {
        node: true,
        es6: true,
    },
    plugins: ['only-warn'],
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
        '@typescript-eslint/no-non-null-assertion': 'off',
        'no-console': 'off',
        'import/order': [
            'error',
            {
                'newlines-between': 'ignore',
            },
        ],
    },
}
