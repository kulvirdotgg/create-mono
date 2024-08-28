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

    if (applications.includes('vite')) {
        fse.copySync(
            path.join(ROOT, 'template/applications/vite'),
            path.join(projectDir, 'apps/vite'),
        )

        fs.copyFileSync(
            path.join(ROOT, 'template/config/eslint/vite.js'),
            path.join(projectDir, 'packages/eslint-config/vite.js'),
        )
        fs.copyFileSync(
            path.join(ROOT, 'template/config/tsconfig/vite.json'),
            path.join(projectDir, 'packages/typescript-config/vite.json'),
        )
    }

    if (applications.includes('express')) {
        fse.copySync(
            path.join(ROOT, 'template/applications/express'),
            path.join(projectDir, 'apps/express'),
        )

        const expPkgJSON = fse.readJSONSync(
            path.join(projectDir, 'apps/express/package.json'),
        )
        if (packageManager == 'npm') {
            expPkgJSON.devDependencies['@types/node'] = '^20.11.24'

            expPkgJSON.scripts.start = 'node dist/index.js'
            expPkgJSON.scripts.dev =
                'tsup --watch --onSuccess "node dist/index.js"'
        } else {
            expPkgJSON.scripts.start = `${packageManager} dist/index.js`
            expPkgJSON.scripts.dev = `tsup --watch --onSuccess \"${packageManager} dist/index.js\"`
        }

        fse.writeJsonSync(
            path.join(projectDir, 'apps/express/package.json'),
            expPkgJSON,
            {
                spaces: 4,
            },
        )

        fs.copyFileSync(
            path.join(ROOT, 'template/config/eslint/server.js'),
            path.join(projectDir, 'packages/eslint-config/server.js'),
        )
    }
}

export { init }

type TInitProject = {
    projectName: string
    applications: string[]
    packageManager: string
}
