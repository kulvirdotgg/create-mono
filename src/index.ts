#! /usr/bin/env node

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
    //TODO: render some kind of title before begining the process. (shameless plug)
    // ASCII art something like theo's t3 could be used.

    const {
        userInputName,
        packageManager,
        applications,
        packages,
        database,
        importAlias,
    } = await cli()

    /*
        path/@repo/package
        scopedName: @repo/package
        projectName: path/package
    */
    const [scopedName, projectName] = pathDetails(userInputName)
    await init(projectName, packageManager, applications, packages, database)

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
