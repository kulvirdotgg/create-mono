import * as p from '@clack/prompts'
import chalk from 'chalk'

import { validateName } from '@/utils/validate-name'

async function cli() {
    const userInputs = await p.group(
        {
            name: () =>
                p.text({
                    message: 'What name would you like to give your monorepo?',
                    defaultValue: '.',
                    validate: validateName,
                }),
            packageManager: () => {
                return p.select({
                    message: 'What package manager would you like to use?',
                    options: [
                        { value: 'bun', label: 'Bun' },
                        { value: 'npm', label: 'npm' },
                        { value: 'pnpm', label: 'pnpm' },
                        { value: 'yarn', label: 'yarn' },
                    ],
                    initialValue: 'bun',
                })
            },
            language: () => {
                return p.select({
                    message: 'Choose your preferred language',
                    options: [
                        { value: 'typescript', label: 'Typescript' },
                        { value: 'javascript', label: 'Javascript' },
                    ],
                    initialValue: 'typescript',
                })
            },
            _: ({ results }) => {
                if (results.language === 'javascript') {
                    return p.note(
                        chalk.redBright(
                            'Skill issues, only Typescript is allowed.'
                        )
                    )
                }
            },
            applications: () => {
                return p.multiselect({
                    message:
                        'What applications will your monorepo contain? (Select all that apply)',
                    options: [
                        // {
                        //     value: 'astro',
                        //     label: 'Astro app',
                        //     hint: 'not available yet',
                        // },
                        {
                            value: 'next',
                            label: 'Next.js (Fullstack/SSR)',
                        },
                        { value: 'vite', label: 'Vite (React App)' },
                        { value: 'express', label: 'Express (Backend API)' },
                    ],
                })
            },
            database: () => {
                return p.select({
                    message: 'Which database do you plan to use?',
                    options: [
                        { value: 'none', label: 'None' },
                        { value: 'postgres', label: 'Postgres' },
                        { value: 'sqlite', label: 'SQLite', hint: 'based' },
                    ],
                    initialValue: 'none',
                })
            },
            orm: ({ results }) => {
                if (results.database !== 'none') {
                    return p.select({
                        message: 'Which ORM would you like to use?',
                        options: [
                            {
                                value: 'none',
                                label: 'None',
                                hint: 'I like to rawdawg sequel',
                            },
                            {
                                value: 'drizzle',
                                label: 'Drizzle',
                                hint: 'W move',
                            },
                            {
                                value: 'prisma',
                                label: 'Prisma',
                            },
                        ],
                        initialValue: 'none',
                    })
                }
            },
            importAlias: () => {
                return p.text({
                    message:
                        'Would you like to change the default import alias?(`@/*`)',
                    defaultValue: '@/',
                    placeholder: '@/',
                })
            },
        },
        {
            onCancel() {
                process.exit(0)
            },
        }
    )

    return {
        userInputName: userInputs.name,
        packageManager: userInputs.packageManager as TPackageManager,
        applications: [...userInputs.applications] as TApplication[],
        orm: userInputs.orm as TOrm,
        database: userInputs.database as TDatabase,
        importAlias: userInputs.importAlias,
    }
}

export { cli }

export type TPackageManager = 'bun' | 'npm' | 'pnpm' | 'yarn'

export type TApplication = 'astro' | 'express' | 'next' | 'vite'

export type TOrm = 'drizzle' | 'prisma' | 'none'

export type TDatabase = 'neon' | 'supabase' | null
