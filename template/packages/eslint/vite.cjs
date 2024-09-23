const { resolve } = require('node:path')

const project = resolve(process.cwd(), 'tsconfig.json')

// Checkout this for more info: https://github.com/vercel/style-guide

/** @type {import("eslint").Linter.Config}*/
module.exports = {
    extends: [
        'turbo',
        require.resolve('@vercel/style-guide/eslint/node'),
        require.resolve('@vercel/style-guide/eslint/typescript'),
    ],
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
    ignorePatterns: ['.*.js', 'node_modules/', 'dist/'],
    rules: {
        "import/no-default-export": "off",
        '@typescript-eslint/array-type': 'off',
        '@typescript-eslint/consistent-type-definitions': 'off',
        '@typescript-eslint/consistent-type-imports': ['warn', {
            prefer: 'type-imports',
        }],
        '@typescript-eslint/no-unused-vars': ['warn', {
            argsIgnorePattern: '^_'
        }],
        'import/order': ['error', {
            'newlines-between': 'always',
            "groups":
                [
                    ['builtin', 'external'],
                    ['sibling', 'parent'],
                    'type'
                ],
            "pathGroups": [
                {
                    "pattern": "@/**",
                    "group": "parent",
                    "position": "after"
                }
            ],
        }],
    },
}
