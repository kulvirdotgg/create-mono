import fs from 'fs'
import fse from 'fs-extra'
import path from 'node:path'
import { sortPackageJson } from 'sort-package-json'

import { ROOT } from '@/CONSTS'
import { dependencyMap } from '@/utils/dependencies'

import type { TPackageManager } from '@/cli'
import { updatePnpmWorkspace } from '@/utils/workspace-pnpm'

function express(projectDir: string, packageManager: TPackageManager) {
    fse.copySync(
        path.join(ROOT, 'template/applications/express'),
        path.join(projectDir, 'apps/express')
    )

    if (packageManager === 'pnpm') {
        const appDir = path.join(projectDir, 'apps/express')
        updatePnpmWorkspace(appDir)
    }

    const packageJSON = fse.readJSONSync(
        path.join(projectDir, 'apps/express/package.json')
    )
    /*
        use node to run files, when not using bun, but seriously use bun, its better
        `node run dist/index.js`
    */
    if (packageManager !== 'bun') {
        packageJSON.scripts.start = 'node dist/index.cjs'
        packageJSON.scripts.dev =
            'tsup --watch --onSuccess "node dist/index.cjs"'
        packageJSON.devDependencies['@types/node'] = dependencyMap['types/node']
    } else {
        packageJSON.devDependencies['@types/bun'] = dependencyMap['types/bun']
    }

    const sortedPackageJSON = sortPackageJson(packageJSON)
    fse.writeJsonSync(
        path.join(projectDir, 'apps/express/package.json'),
        sortedPackageJSON,
        {
            spaces: 4,
        }
    )

    fs.copyFileSync(
        path.join(ROOT, 'template/packages/eslint/server.cjs'),
        path.join(projectDir, 'packages/eslint-config/server.cjs')
    )
}

export { express }
