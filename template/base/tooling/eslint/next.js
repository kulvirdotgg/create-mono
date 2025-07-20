import globals from 'globals'
import pluginNext from '@next/eslint-plugin-next'
import pluginReact from 'eslint-plugin-react'
import pluginReactHooks from 'eslint-plugin-react-hooks'

import { baseConfig } from './index.js'

/**
 * @type {import("eslint").Linter.Config}
 */
export const next = [
    ...baseConfig,
    pluginReact.configs.flat.recommended,
    {
        plugins: {
            '@next/next': pluginNext,
            'react-hooks': pluginReactHooks,
        },
        rules: {
            ...pluginNext.configs.recommended.rules,
            ...pluginNext.configs['core-web-vitals'].rules,
            ...pluginReactHooks.configs.recommended.rules,
            'react/react-in-jsx-scope': 'off',
        },
        settings: { react: { version: 'detect' } },
        languageOptions: {
            ...pluginReact.configs.flat.recommended.languageOptions,
            globals: {
                ...globals.serviceworker,
            },
        },
    },
]
