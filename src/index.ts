#! /usr/bin/env node

import figlet from 'figlet'
import fse from 'fs-extra'
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

    const {
        userInputName,
        packageManager,
        applications,
        orm,
        database,
        importAlias,
    } = await cli()

    /**
     * /some/path/@repo/package
     * scopedName: @repo/package
     * projectName: /some/path/package
     */
    const [scopedName, projectName] = pathDetails(userInputName)
    await init(projectName, packageManager, applications, orm, database)

    try {
        const basePackageJSON = fse.readJSONSync(
            path.join(projectName, 'package.json')
        )
        basePackageJSON.name = scopedName
        const { stdout } = await execa(packageManager, ['-v'], {
            cwd: projectName,
        })

        basePackageJSON.packageManager = packageManager + '@' + stdout.trim()
        fse.writeJsonSync(
            path.join(projectName, 'package.json'),
            basePackageJSON,
            {
                spaces: 4,
            }
        )
    } catch (err) {
        console.log(
            chalk.bold.redBright(
                `${packageManager} not found. Try again after installing.`
            )
        )
        const spin = ora('Project creation failed...').start()
        await execa('rm', ['-rf', projectName])
        spin.fail()
        process.exit(1)
    }

    updateImportAlias(projectName, importAlias)
    if (applications.includes('vite')) {
        const vitePath = path.join(projectName, 'apps/vite/vite.config.ts')
        updateViteAlias(vitePath, importAlias)
    }

    process.exit(0)
}

main()
