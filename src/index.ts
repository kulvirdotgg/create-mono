#! /usr/bin/env node

import { cli } from './cli/index'
import { pathDetails } from './utils/path-details'
import { init } from './creators/init'

async function main() {
    // TODO: Refactor this func to return each package details
    const { applications, packageManager, repoName } = await cli()

    const [scopedName, projectName] = pathDetails(repoName)
    await init({ projectName, applications, packageManager })

    process.exit(0)
}

main()
