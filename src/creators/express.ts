import fs from 'fs'
import fse from 'fs-extra'
import path from 'node:path'

import { ROOT } from '../CONSTS'
import { sortPackageJson } from 'sort-package-json'
import { dependencyMap } from '../utils/dependencies'

function express(projectDir: string, packageManager: string) {
    fse.copySync(
        path.join(ROOT, 'template/applications/express'),
        path.join(projectDir, 'apps/express')
    )

    const packageJSON = fse.readJSONSync(
        path.join(projectDir, 'apps/express/package.json')
    )

    // `node run dist/index.js` for other than bun.
    if (packageManager !== 'bun') {
        packageJSON.scripts.start = 'node dist/index.js'
        packageJSON.scripts.dev =
            'tsup --watch --onSuccess "node dist/index.cjs"'

        packageJSON.devDependencies['@types/node'] = dependencyMap['types/node']

        // pnpm workspaces fucks me everytime
        if (packageManager === 'pnpm') {
            packageJSON.devDependencies['@repo/eslint-config'] = 'workspace:*'
            packageJSON.devDependencies['@repo/typescript-config'] =
                'workspace:*'
        }
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
        path.join(ROOT, 'template/deps/eslint/server.cjs'),
        path.join(projectDir, 'packages/eslint-config/server.cjs')
    )
}

export { express }
