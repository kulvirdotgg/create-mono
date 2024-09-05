#! /usr/bin/env node

import fse from 'fs-extra'
import path from 'node:path'
import { execa } from 'execa'

import { cli } from './cli/index'
import { pathDetails } from './utils/path-details'
import { init } from './creators/init'
import { deps } from './cli/deps'
import { addAppDeps } from './adder'

async function main() {
    //TODO: render some kind of title before begining the process. (shameless plug)
    // ASCII art something like theo's t3 could be used.

    const { applications, packageManager, repoName } = await cli()

    const [scopedName, projectName] = pathDetails(repoName)
    await init({ projectName, applications, packageManager })

    const basePkgJSON = fse.readJSONSync(path.join(projectName, 'package.json'))
    basePkgJSON.name = scopedName

    // TODO: try catch block here, if user doens't have that package manager installed exit.
    try {
        const { stdout } = await execa(packageManager, ['-v'], {
            cwd: projectName,
        })

        basePkgJSON.packageManager = packageManager + '@' + stdout.trim()
        fse.writeJsonSync(path.join(projectName, 'package.json'), basePkgJSON, {
            spaces: 4,
        })
    } catch (err) {
        console.log('failed')
        process.exit(1)
    }

    const { vite, express } = await deps(applications)
    await addAppDeps(projectName, express, vite)
    process.exit(0)
}

main()
