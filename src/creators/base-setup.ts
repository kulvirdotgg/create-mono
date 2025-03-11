import chalk from 'chalk'
import { execa } from 'execa'
import fse from 'fs-extra'
import ora from 'ora'
import path from 'node:path'
import * as p from '@clack/prompts'

import { ROOT } from '@/CONSTS'
import type { TInitOpts } from '@/utils/types'

async function baseSetup({
    projectName,
    projectDir,
    packageManager,
}: TInitOpts) {
    const spin = ora(
        `Initializing monorepo in: ${chalk.bold(projectDir)}...\n`
    ).start()

    if (fse.existsSync(projectDir)) {
        if (fse.readdirSync(projectDir).length === 0) {
            if (projectDir !== '.') {
                spin.warn(
                    `${chalk.bold.cyan(projectDir)} ${chalk.yellow('present but empty, continuing...\n')}`
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
        path.join(projectDir, 'prettier-config.js'),
        path.join(projectDir, 'prettier.config.js')
    )
    fse.renameSync(
        path.join(projectDir, 'gitignore'),
        path.join(projectDir, '.gitignore')
    )

    fse.renameSync(
        path.join(projectDir, 'prettierignore'),
        path.join(projectDir, '.prettierignore')
    )

    try {
        // set the name of repo in package.json
        const packageJSON = fse.readJSONSync(
            path.join(projectDir, 'package.json')
        )
        packageJSON.name = projectName

        // set package manager field in root package.json
        const { stdout } = await execa(packageManager!, ['-v'], {
            cwd: projectDir,
        })
        packageJSON.packageManager = packageManager + '@' + stdout.trim()

        fse.writeJsonSync(path.join(projectDir, 'package.json'), packageJSON, {
            spaces: 4,
        })
    } catch (err: unknown) {
        throw new Error('ERR_NO_PKG_MANAGER')
    }

    spin.succeed(
        `${chalk.cyan.bold(projectName)} initialized successfully...\n`
    )
}

export { baseSetup }
