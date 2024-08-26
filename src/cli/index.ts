import * as p from '@clack/prompts'
import chalk from 'chalk'

import { validateName } from '../utils/validate-name'

async function cli() {
    const userInputs = await p.group(
        {
            repoName: () =>
                p.text({
                    message: 'Name of your project',
                    defaultValue: '.',
                    validate: validateName,
                }),
            pacMan: () => {
                return p.select({
                    message: 'Choose your package manager',
                    options: [
                        {
                            value: 'npm',
                            label: 'npm',
                            hint: 'Not supported yet',
                        },
                        { value: 'bun', label: 'Bun' },
                        // TODO: support pnpm and yarn too
                        {
                            value: 'pnpm',
                            label: chalk.redBright('pnpm'),
                            hint: 'Not supported yet',
                        },
                        {
                            value: 'yarn',
                            label: chalk.redBright('Yarn'),
                            hint: 'Not supported yet',
                        },
                    ],
                    initialValue: 'npm',
                })
            },
            // NOTE: Remove then when pnpm and yarn are supported
            _: ({ results }) => {
                if (
                    results.pacMan === 'pnpm' ||
                    results.pacMan === 'yarn' ||
                    results.pacMan === 'npm'
                ) {
                    p.cancel(
                        chalk.redBright(
                            'Told yaa this package manager is not supported yet, I am working on it. Let me have sigh of relief',
                        ),
                    )
                    process.exit(0)
                }
            },
            apps: () => {
                return p.multiselect({
                    message:
                        'What applications you want to have in your monorepo?',
                    options: [
                        { value: 'vite', label: 'Vite single page app' },
                        { value: 'express', label: 'Express API' },
                        // TODO: add next and astro templates.
                        {
                            value: 'elysia',
                            label: chalk.redBright('Elysia API'),
                            hint: 'not available yet',
                        },
                        {
                            value: 'hono',
                            label: chalk.redBright('Hono API'),
                            hint: 'not available yet',
                        },
                        {
                            value: 'next',
                            label: chalk.redBright('Next App') + '(app router)',
                            hint: 'not available yet',
                        },
                        {
                            value: 'astro',
                            label: chalk.redBright('Astro app'),
                            hint: 'not available yet',
                        },
                    ],
                })
            },
            //NOTE: Remove when next and astro template is added
            __: ({ results }) => {
                if (
                    results.apps?.includes('hono') ||
                    results.apps?.includes('elysia') ||
                    results.apps?.includes('next') ||
                    results.apps?.includes('astro')
                ) {
                    p.cancel(
                        chalk.redBright(
                            'This framework is not yet supported, If needed create on your own.',
                        ),
                    )
                    process.exit(0)
                }
            },
            language: () => {
                return p.select({
                    message:
                        'Will you be using Javascript or Typescript in all application?',
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
            ___: ({ results }) => {
                if (results.language === 'javascript') {
                    return p.note(
                        chalk.redBright(
                            'Skill issues, you will use only Typescript',
                        ),
                    )
                }
            },
            uiPackage: () => {
                return p.confirm({
                    message:
                        'Do you want a shared ' +
                        chalk.cyan.bold('ui') +
                        ' package? (Tailwind w shad-cn)',
                })
            },
        },
        {
            onCancel() {
                process.exit(0)
            },
        },
    )

    return {
        repoName: userInputs.repoName,
        packageManager: userInputs.pacMan,
        applications: [...userInputs.apps],
        uiPackage: userInputs.uiPackage,
    }
}

export { cli }
