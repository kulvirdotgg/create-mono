const { resolve } = require('node:path')

const project = resolve(process.cwd(), 'tsconfig.json')

/** @type {import("eslint").Linter.Config} */
module.exports = {
    extends: [
        'eslint:recommended',
        'prettier',
        'turbo',
        'plugin:@typescript-eslint/recommended-type-checked',
        'plugin:@typescript-eslint/stylistic-type-checked',
    ],
    plugins: ['only-warn', '@typescript-eslint'],
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
    overrides: [
        {
            files: ['*.js?(x)', '*.ts?(x)'],
        },
    ],
    ignorePatterns: ['.*.js', 'node_modules/', 'dist/'],
    rules: {
        '@typescript-eslint/array-type': 'off',
        '@typescript-eslint/consistent-type-definitions': 'off',
        '@typescript-eslint/consistent-type-imports': [
            'warn',
            {
                prefer: 'type-imports',
            },
        ],
        '@typescript-eslint/no-unused-vars': [
            'warn',
            { argsIgnorePattern: '^_' },
        ],
    },
}
