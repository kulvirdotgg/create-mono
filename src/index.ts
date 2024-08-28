#! /usr/bin/env node

import fse from 'fs-extra'
import path from 'node:path'
import { execa } from 'execa'

import { cli } from './cli/index'
import { pathDetails } from './utils/path-details'
import { init } from './creators/init'

async function main() {
    // TODO: Refactor this func to return each package details
    const { applications, packageManager, repoName } = await cli()

    const [scopedName, projectName] = pathDetails(repoName)
    await init({ projectName, applications, packageManager })

    const basePkgJSON = fse.readJSONSync(path.join(projectName, 'package.json'))
    basePkgJSON.name = scopedName

    const { stdout } = await execa(packageManager, ['-v'], {
        cwd: projectName,
    })
    basePkgJSON.packageManager = packageManager + '@' + stdout.trim()
    fse.writeJsonSync(path.join(projectName, 'package.json'), basePkgJSON, {
        spaces: 4,
    })

    process.exit(0)
}

main()
