import chalk from 'chalk'
import fs from 'fs-extra'
import ora from 'ora'
import path from 'node:path'
import * as p from '@clack/prompts'

import { ROOT } from '../CONSTS'

/*
projectName: name of the project (user input)
*/
async function createBase(projectName: string) {
    const projectDir = path.resolve(process.cwd(), projectName)

    const spin = ora('Starting monorepo in: ' + projectDir + '...\n').start()

    if (fs.existsSync(projectDir)) {
        if (fs.readdirSync(projectDir).length === 0) {
            if (projectName !== '.')
                spin.info(
                    chalk.cyan.bold(projectName) +
                        ' present but empty (like life), continuing...\n',
                )
        } else {
            spin.stopAndPersist()

            const overwrite = await p.select({
                message:
                    chalk.redBright.bold('warning: ') +
                    chalk.cyan.bold(projectName) +
                    ' exists, Still proceed?',
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
                message: 'Are you sure you want to ' + action,
                initialValue: false,
            })

            if (!confirmOverwrite) {
                spin.fail('Aborting...')
                process.exit(1)
            }

            if (overwrite === 'clear') {
                spin.info(
                    chalk.cyan.bold(projectName) +
                        'clearning and continuing...',
                )
                fs.emptyDirSync(projectDir)
            }

            spin.stopAndPersist()
        }
    }
    spin.start()

    const base = path.join(ROOT, 'template/base')

    fs.copySync(base, projectDir)
    fs.renameSync(
        path.join(projectDir, 'gitignore'),
        path.join(projectDir, '.gitignore'),
    )
    const baseName = projectName === '.' ? 'App' : chalk.cyan.bold(projectName)
    spin.succeed(baseName + ' created successfully...\n')
}

export { createBase }
