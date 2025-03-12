import * as p from '@clack/prompts'
import chalk from 'chalk'

import { validateProjectName } from '@/utils/validate-project-name'

async function cli() {
    const userInputs = await p.group(
        {
            name: () =>
                p.text({
                    message: 'What name would you like to give your monorepo?',
                    defaultValue: '.',
                    validate: validateProjectName,
                }),
            packageManager: () => {
                return p.select({
                    message: 'What package manager would you like to use?',
                    options: [
                        { value: 'bun', label: 'bun' },
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
            orm: () => {
                return p.select({
                    message: 'Which ORM would you like to use?',
                    options: [
                        {
                            value: 'none',
                            label: 'None',
                            hint: 'I like to rawdawg my SEQUEL',
                        },
                        {
                            value: 'drizzle',
                            label: 'Drizzle',
                        },
                        {
                            value: 'prisma',
                            label: 'Prisma',
                        },
                    ],
                    initialValue: 'none',
                })
            },
            database: ({ results }) => {
                if (results.orm !== 'none') {
                    return p.select({
                        message: 'Which database do you plan to use?',
                        options: [
                            { value: 'postgres', label: 'Postgres' },
                            { value: 'sqlite', label: 'SQLite (LibSQL)' },
                        ],
                        initialValue: 'none',
                    })
                }
            },
            importAlias: () => {
                return p.text({
                    message: 'What import alias would you like to use?',
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
        userInputPath: userInputs.name,
        packageManager: userInputs.packageManager as TPackageManager,
        applications: [...userInputs.applications] as TApplication[],
        orm: userInputs.orm as TOrm,
        database: userInputs.database as TDatabase,
        importAlias: userInputs.importAlias,
    }
}

export { cli }

export type TPackageManager = 'bun' | 'npm' | 'pnpm' | 'yarn'

export type TApplication = 'astro' | 'express' | 'next' | 'vite' | 'rn'

export type TOrm = 'drizzle' | 'none' | 'prisma'

export type TDatabase = 'postgres' | 'sqlite'
