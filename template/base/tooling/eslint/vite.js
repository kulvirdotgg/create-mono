import globals from 'globals'
import pluginReactHooks from 'eslint-plugin-react-hooks'
import pluginReact from 'eslint-plugin-react'
import reactRefresh from 'eslint-plugin-react-refresh'

import { baseConfig } from './index.js'

/**
 * @type {import("eslint").Linter.Config}
 */
export const vite = [
    ...baseConfig,
    pluginReact.configs.flat.recommended,
    {
        files: ['**/*.{ts,tsx}'],
    },
    {
        languageOptions: {
            ...pluginReact.configs.flat.recommended.languageOptions,
            globals: {
                ...globals.serviceworker,
                ...globals.browser,
            },

            ecmaVersion: 'latest',
            globals: globals.browser,
            sourceType: 'module',
        },
    },
    {
        plugins: {
            'react-hooks': pluginReactHooks,
            'react-refresh': reactRefresh,
        },
        settings: { react: { version: 'detect' } },
        rules: {
            ...pluginReactHooks.configs.recommended.rules,
            'react/react-in-jsx-scope': 'off',
            'react-refresh/only-export-components': [
                'warn',
                { allowConstantExport: true },
            ],
        },
    },
]
