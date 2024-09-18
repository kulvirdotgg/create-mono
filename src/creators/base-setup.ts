import chalk from 'chalk'
import fse from 'fs-extra'
import ora from 'ora'
import path from 'node:path'
import * as p from '@clack/prompts'

import { ROOT } from '../CONSTS'

async function baseSetup(projectName: string, projectDir: string) {
    const spin = ora(
        `Initializing monorepo in: ${chalk.bold(projectDir)}...\n`
    ).start()

    if (fse.existsSync(projectDir)) {
        if (fse.readdirSync(projectDir).length === 0) {
            if (projectName !== '.') {
                spin.warn(
                    `${chalk.bold.cyan(projectName)} ${chalk.yellow('present but empty (dejavu of life), continuing...\n')}`
                )
            }
        } else {
            spin.stopAndPersist()

            const overwrite = await p.select({
                message: `${chalk.redBright.bold('warning: ')}: ${chalk.bold.yellow(projectName)} ${chalk.yellow('exists, Still wanna proceed?')}`,
                options: [
                    {
                        label: 'Stop installation (recommended)',
                        value: 'abort',
                    },
                    {
                        label: 'Clear the directory and continue...',
                        value: 'clear',
                    },
                    {
                        label: 'Overwrite conflicting files...',
                        value: 'overwrite',
                    },
                ],
                initialValue: 'abort',
            })
            if (overwrite === 'abort') {
                spin.fail('Aborting...')
                process.exit(1)
            }

            const action =
                overwrite === 'clear'
                    ? 'clear the directory'
                    : 'overwrite conflicting files'

            const confirmOverwrite = await p.confirm({
                message: `Are you sure you want to  ${action}`,
                initialValue: false,
            })

            if (!confirmOverwrite) {
                spin.fail('Aborting...')
                process.exit(1)
            }

            if (overwrite === 'clear') {
                spin.info(
                    `${chalk.cyan.bold(projectName)} clearning and continuing...`
                )
                fse.emptyDirSync(projectDir)
            }
            spin.stopAndPersist()
        }
    }
    spin.start()

    const base = path.join(ROOT, 'template/base')
    fse.copySync(base, projectDir)
    fse.renameSync(
        path.join(projectDir, 'gitignore'),
        path.join(projectDir, '.gitignore')
    )

    const baseName = projectName === '.' ? 'App' : chalk.cyan.bold(projectName)
    spin.succeed(`Monorepo ${baseName} initialized successfully...\n`)
}

export { baseSetup }
