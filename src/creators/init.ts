import fs from 'fs'
import fse from 'fs-extra'
import path from 'path'

import { createBase } from './base-setup'
import { ROOT } from '../CONSTS'

async function init({
    projectName,
    applications,
    packageManager,
}: TInitProject) {
    console.log(projectName)
    const projectDir = path.resolve(process.cwd(), projectName)

    await createBase(projectName, projectDir)

    if (applications.includes('express')) {
        fse.copySync(
            path.join(ROOT, 'template/applications/express'),
            path.join(projectDir, 'apps/express-api'),
        )

        fs.copyFileSync(
            path.join(ROOT, 'template/config/eslint/express-api.js'),
            path.join(projectDir, 'package/config-eslint/express-api.js'),
        )
    }
}

export { init }

type TInitProject = {
    projectName: string
    applications: string[]
    packageManager: string
}
