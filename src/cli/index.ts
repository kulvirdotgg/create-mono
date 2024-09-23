import * as p from '@clack/prompts'
import chalk from 'chalk'

import { validateName } from '@/utils/validate-name'

async function cli() {
    const userInputs = await p.group(
        {
            name: () =>
                p.text({
                    message: 'Name of your project',
                    defaultValue: '.',
                    validate: validateName,
                }),
            packageManager: () => {
                return p.select({
                    message: 'Choose your package manager',
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
                    message:
                        'Will you be using Javascript or Typescript in monorepo?',
                    options: [
                        { value: 'typescript', label: 'Typescript' },
                        {
                            value: 'javascript',
                            label: 'Javascript',
                            hint: 'Skill issues',
                        },
                    ],
                    initialValue: 'typescript',
                })
            },
            _: ({ results }) => {
                if (results.language === 'javascript') {
                    return p.note(
                        chalk.redBright(
                            'Skill issues, you will use only Typescript'
                        )
                    )
                }
            },
            applications: () => {
                return p.multiselect({
                    message: `What application packages do you want to add?' ${chalk.cyan('(space to select)')}`,
                    options: [
                        {
                            value: 'astro',
                            label: chalk.redBright('Astro app'),
                            hint: 'not available yet',
                        },
                        {
                            value: 'next',
                            label: chalk.redBright('Next App') + '(app router)',
                            hint: 'not available yet',
                        },
                        { value: 'vite', label: 'Vite SPA' },
                        { value: 'express', label: 'Express API' },
                    ],
                })
            },
            //TODO: Remove when next and astro template is added
            __: ({ results }) => {
                if (
                    results.applications?.includes('next') ||
                    results.applications?.includes('astro')
                ) {
                    p.cancel(
                        chalk.redBright(
                            'This framework is not yet supported, If needed create on your own.'
                        )
                    )
                    process.exit(0)
                }
            },
            orm: () => {
                return p.select({
                    message: 'What ORM would you like to use?',
                    options: [
                        { value: 'none', label: 'None' },
                        { value: 'drizzle', label: 'Drizzle' },
                        { value: 'prisma', label: 'Prisma' },
                    ],
                    initialValue: 'none',
                })
            },
            database: ({ results }) => {
                if (results.orm !== 'none') {
                    return p.select({
                        message: 'Select Database provider',
                        options: [
                            { value: 'neon', label: 'Neon Serverless' },
                            { value: 'supabase', label: 'Supabase' },
                        ],
                        initialValue: 'neon',
                    })
                }
            },
            importAlias: () => {
                return p.text({
                    message: 'Import alias',
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
