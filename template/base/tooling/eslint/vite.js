import eslintConfigPrettier from "eslint-config-prettier";
import globals from 'globals'
import pluginReactHooks from "eslint-plugin-react-hooks";
import reactRefresh from 'eslint-plugin-react-refresh'
import { baseConfig } from "./base.js";

export const vite = [
    ...baseConfig,
    reactRefresh,
    eslintConfigPrettier,
    {
        files: ['**/*.{ts,tsx}']
    },
    {
        languageOptions: {
            ...pluginReact.configs.flat.recommended.languageOptions,
            globals: {
                ...globals.serviceworker,
                ...globals.browser,
            },

            ecmaVersion: "latest",
            globals: globals.browser,
            sourceType: "module"
        },
    },
    {
        plugins: {
            "react-hooks": pluginReactHooks,
            'react-refresh': reactRefresh,
        },
        settings: { react: { version: "detect" } },
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
