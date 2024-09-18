import * as p from '@clack/prompts'
import chalk from 'chalk'

import { validateName } from '../utils/validate-name'

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
            applications: () => {
                return p.multiselect({
                    message:
                        'What applications you want to have in your monorepo?' +
                        chalk.cyan('(space to select)'),
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
            _: ({ results }) => {
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
            __: ({ results }) => {
                if (results.language === 'javascript') {
                    return p.note(
                        chalk.redBright(
                            'Skill issues, you will use only Typescript'
                        )
                    )
                }
            },
            importAlias: () => {
                return p.text({
                    message: 'Import alias',
                    defaultValue: '@/',
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
        packageManager: userInputs.packageManager,
        applications: [...userInputs.applications] as string[],
        importAlias: userInputs.importAlias,
    }
}

export { cli }
