#! /usr/bin/env node

import { projectDetails } from './cli/index'
import { pathDetails } from './utils/path-details'
import { init } from './creators/init'

async function main() {
    // TODO: Refactor this func to return each package details
    const details = await projectDetails

    const [scopedName, projectName] = pathDetails(details.name)
    await init(projectName)

    process.exit(0)
}

main()
