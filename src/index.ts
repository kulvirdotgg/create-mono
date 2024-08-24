#! /usr/bin/env node

import { projectDetails } from './cli/index'
import { pathDetails } from './utils/path-details'
import { createBase } from './utils/base-setup'

async function main() {
    const details = await projectDetails

    const [scopedName, projectName] = pathDetails(details.name)
    await createBase(projectName)

    process.exit(0)
}

main()
