import fs from 'fs'
import path from 'path'
import fse from 'fs-extra'

import { createBase } from './base-setup'
import { expressJSON } from './express-json'
import { viteJSON } from './vite-json'
import { ROOT } from '../CONSTS'

async function init({
    projectName,
    applications,
    packageManager,
}: TInitProject) {
    const projectDir = path.resolve(process.cwd(), projectName)

    await createBase(projectName, projectDir)

    // pnpm got weird workspaces things
    if (packageManager === 'pnpm') {
        const pkgJSON = fse.readJSONSync(
            path.resolve(projectDir, 'package.json'),
        )
        delete pkgJSON['workspaces']

        fse.writeJsonSync(path.join(projectDir, 'package.json'), pkgJSON, {
            spaces: 4,
        })

        fs.copyFileSync(
            path.join(ROOT, 'template/deps/configs/pnpm-workspace.yaml'),
            path.join(projectDir, 'pnpm-workspace.yaml'),
        )
    }

    if (applications.includes('vite')) {
        viteJSON(projectDir, packageManager)
    }

    if (applications.includes('express')) {
        expressJSON(projectDir, packageManager)
    }
}

export { init }

type TInitProject = {
    projectName: string
    applications: string[]
    packageManager: string
}
