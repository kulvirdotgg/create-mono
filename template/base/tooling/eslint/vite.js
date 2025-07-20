import globals from 'globals'
import pluginReact from 'eslint-plugin-react'
import pluginReactHooks from 'eslint-plugin-react-hooks'
import pluginReactRefresh from 'eslint-plugin-react-refresh'

import { baseConfig } from './index.js'

/**
 * @type {import("eslint").Linter.Config}
 */
export const vite = [
    ...baseConfig,
    pluginReact.configs.flat.recommended,
    {
        files: ['**/*.{ts,tsx}'],
        plugins: {
            'react-hooks': pluginReactHooks,
            'react-refresh': pluginReactRefresh,
        },
        rules: {
            ...pluginReactHooks.configs.recommended.rules,

            'react/react-in-jsx-scope': 'off',
            'react-refresh/only-export-components': [
                'warn',
                { allowConstantExport: true },
            ],
        },
        settings: { react: { version: 'detect' } },
        languageOptions: {
            ...pluginReact.configs.flat.recommended.languageOptions,
            globals: {
                ...globals.serviceworker,
                ...globals.browser,
            },
        },
    },
]
