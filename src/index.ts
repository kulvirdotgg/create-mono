#! /usr/bin/env node

import { projectDetails } from './cli/index'
import { pathDetails } from './utils/pathDetails'
import { createBase } from './utils/base-setup'

async function main() {
    const pkgManager = 'bun'
    const details = await projectDetails

    const [path, name] = pathDetails(details.name)
    createBase(name, path, 'bun')

    process.exit(0)
}

main()
