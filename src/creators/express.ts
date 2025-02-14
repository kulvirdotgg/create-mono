import fse from 'fs-extra'
import path from 'node:path'
import { sortPackageJson } from 'sort-package-json'

import { ROOT } from '@/CONSTS'
import { dependencyMap } from '@/utils/dependencies'

import type { TPackageManager } from '@/cli'
import { updateWorkspaceDependencies } from '@/utils/workspace-dependancy'

function express(projectDir: string, packageManager: TPackageManager) {
    // copy the Express template to user's machine
    fse.copySync(
        path.join(ROOT, 'template/applications/express'),
        path.join(projectDir, 'apps/express')
    )

    if (packageManager === 'pnpm' || packageManager === 'bun') {
        const appDir = path.join(projectDir, 'apps/express')
        updateWorkspaceDependencies(appDir)
    }

    const packageJSON = fse.readJSONSync(
        path.join(projectDir, 'apps/express/package.json')
    )
    /*
        use node to run files, when not using bun, but seriously use bun, its better
        `node run dist/index.js`
    */
    if (packageManager === 'bun') {
        packageJSON.scripts.start = 'bun dist/index.js'
        packageJSON.scripts.dev = 'tsup --watch --onSuccess "bun dist/index.js"'
        packageJSON.devDependencies['@types/bun'] = dependencyMap['types/bun']
    } else {
        packageJSON.devDependencies['@types/node'] = dependencyMap['types/node']
    }

    const sortedPackageJSON = sortPackageJson(packageJSON)
    fse.writeJsonSync(
        path.join(projectDir, 'apps/express/package.json'),
        sortedPackageJSON,
        {
            spaces: 4,
        }
    )
}

export { express }
