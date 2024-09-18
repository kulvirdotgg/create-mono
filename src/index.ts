#! /usr/bin/env node

import fse from 'fs-extra'
import path from 'node:path'
import { execa } from 'execa'
import ora from 'ora'

import { cli } from './cli/index'
import { pathDetails } from './utils/path-details'
import { init } from './creators/init'
import { deps } from './cli/deps'
import { addAppDeps } from './adder'
import { updateImportAlias, updateViteAlias } from './utils/update-import-alisa'
import chalk from 'chalk'

async function main() {
    //TODO: render some kind of title before begining the process. (shameless plug)
    // ASCII art something like theo's t3 could be used.

    const {
        applications,
        packageManager,
        projectName: repoName,
        importAlias,
    } = await cli()

    /*
        path/@repo/package
        scopedName: @repo/package
        projectName: path/package
    */
    const [scopedName, projectName] = pathDetails(repoName)
    await init({ projectName, applications, packageManager })

    const basePackageJSON = fse.readJSONSync(
        path.join(projectName, 'package.json')
    )
    basePackageJSON.name = scopedName

    try {
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
                `${packageManager} does not exist on this machine`
            )
        )
        const spin = ora(
            `Project creation failed... removing ${chalk.bold.cyanBright(projectName)}`
        ).start()
        await execa('rm', ['-rf', projectName])
        spin.fail()
        process.exit(1)
    }

    const { vite, express } = await deps(applications)
    await addAppDeps(projectName, express, vite)

    // update the import alias
    updateImportAlias(projectName, importAlias)
    if (vite) {
        const vitePath = path.join(projectName, 'apps/vite/vite.config.ts')
        updateViteAlias(vitePath, importAlias)
    }

    process.exit(0)
}

main()
