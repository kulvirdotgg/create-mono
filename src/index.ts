#! /usr/bin/env node

import figlet from 'figlet'
import path from 'node:path'
import { execa } from 'execa'
import ora from 'ora'
import chalk from 'chalk'

import { cli } from '@/cli/index'
import { pathDetails } from '@/utils/path-details'
import { init } from '@/creators/init'
import { updateImportAlias, updateViteAlias } from '@/utils/update-import-alias'

async function main() {
    const TITLE = figlet.textSync('create-mono')
    console.log(chalk.cyan(TITLE))

    // TODO: check for available package manager in cli phase only
    const {
        userInputPath,
        packageManager,
        applications,
        orm,
        database,
        importAlias,
    } = await cli()

    const [projectName, projectDir] = pathDetails(userInputPath)

    try {
        await init({
            projectName,
            projectDir,
            packageManager,
            applications,
            orm,
            database,
        })

        updateImportAlias(projectDir, importAlias)

        // TODO: move this to some creators
        if (applications.includes('vite')) {
            const vitePath = path.join(projectDir, 'apps/vite/vite.config.ts')
            updateViteAlias(vitePath, importAlias)
        }
    } catch (err: any) {
        if (err.message === 'ERR_NO_PKG_MANAGER') {
            console.log(
                chalk.redBright(
                    `${packageManager} not found. Try again after installing.`
                )
            )
        }
        const spin = ora('Project creation failed...').start()
        await execa('rm', ['-rf', projectDir])
        spin.fail()
        process.exit(1)
    }

    process.exit(0)
}

main()
