import path from 'node:path'
import fs from 'fs-extra'

import * as p from '@clack/prompts'
import ora from 'ora'
import chalk from 'chalk'

import { ROOT } from '../CONSTS'

/*
name: name of the project
dir: path to the directory where to initialize
pkgManager: package manager [npm, bun, pnpm]
*/
async function createBase(projectName, dir, pkgManager) {
    const files = path.join(ROOT, 'template/base')

    const waiter = ora(`Starting monorepo in: ${dir}...\n`).start()

    if (fs.existsSync(dir)) {
        if (fs.readdirSync(dir).length === 0) {
            if (projectName !== '.')
                waiter.info(
                    `${chalk.cyan.bold(projectName)} directory is already present but empty (like life), continuing...\n`,
                )
        } else {
            waiter.stopAndPersist()

            const overwrite = await p.select({
                message: `${chalk.redBright.bold('Warning:')} ${chalk.cyan.bold(
                    projectName,
                )} exists and isn't empty. Still proceed?`,
                options: [
                    {
                        label: 'Stop installation (recommended)',
                        value: 'abort',
                    },
                    {
                        label: 'naah continue...',
                        value: 'continue',
                    },
                ],
                initialValue: 'abort',
            })
            if (overwrite === 'abort') {
                waiter.fail('Aborting...')
                process.exit(1)
            }
            if (overwrite === 'clear') {
                waiter.info('continuing...')
            }
        }
    }
    waiter.start()

    fs.copySync(files, projectName)
    fs.renameSync(path.join(dir, 'gitignore'), path.join(dir, '.gitignore'))
    waiter.succeed('Base created successfully...')
}

export { createBase }
