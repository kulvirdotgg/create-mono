import { resolve } from 'node:path'

const project = resolve(process.cwd(), 'tsconfig.json')

/** @type {import("eslint").Linter.Config} */
export default {
    extends: ['eslint:recommended', 'prettier', 'eslint-config-turbo'],
    parser: '@typescript-eslint/parser',
    plugins: ['only-warn'],
    globals: {
        React: true,
        JSX: true,
    },
    env: {
        node: true,
    },
    settings: {
        'import/resolver': {
            typescript: {
                project,
            },
        },
    },
    ignorePatterns: [
        // Ignore dotfiles
        '.*.js',
        'node_modules/',
        'dist/',
    ],
    overrides: [
        {
            files: ['*.js?(x)', '*.ts?(x)'],
        },
    ],
}
