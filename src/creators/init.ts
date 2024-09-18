import path from 'path'
import fse from 'fs-extra'

import { baseSetup } from './base-setup'
import { express } from './express'
import { vite } from './vite'
import { ROOT } from '../CONSTS'

async function init({
    projectName,
    applications,
    packageManager,
}: TInitProject) {
    const projectDir = path.resolve(process.cwd(), projectName)

    await baseSetup(projectName, projectDir)

    // pnpm got weird workspaces setup
    if (packageManager === 'pnpm') {
        const packageJSON = fse.readJSONSync(
            path.resolve(projectDir, 'package.json')
        )
        delete packageJSON['workspaces']
        fse.writeJsonSync(path.join(projectDir, 'package.json'), packageJSON, {
            spaces: 4,
        })

        fse.copyFileSync(
            path.join(ROOT, 'template/deps/configs/pnpm-workspace.yaml'),
            path.join(projectDir, 'pnpm-workspace.yaml')
        )
    }

    if (applications.includes('vite')) {
        vite(projectDir, packageManager)
    }

    if (applications.includes('express')) {
        express(projectDir, packageManager)
    }
}

export { init }

type TInitProject = {
    projectName: string
    applications: string[]
    packageManager: string
}
