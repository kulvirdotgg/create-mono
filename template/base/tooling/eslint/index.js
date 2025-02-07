import prettierPlugin from 'eslint-plugin-prettier/recommended'
import js from '@eslint/js'
import onlyWarn from 'eslint-plugin-only-warn'
import turboPlugin from 'eslint-plugin-turbo'
import tseslint from 'typescript-eslint'

export const baseConfig = [
    js.configs.recommended,
    prettierPlugin,
    ...tseslint.configs.recommended,
    {
        plugins: {
            turbo: turboPlugin,
        },
        rules: {
            'turbo/no-undeclared-env-vars': 'warn',
        },
    },
    {
        plugins: {
            onlyWarn,
        },
    },
    {
        plugins: {
            "simple-import-sort": simpleImportSort,
        },
        rules: {
            "simple-import-sort/imports": "error",
            "simple-import-sort/exports": "error",
        },
    },
    {
        ignores: ['dist/**'],
    },
]
