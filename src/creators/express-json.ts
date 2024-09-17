import fs from 'fs'
import fse from 'fs-extra'
import path from 'node:path'

import { ROOT } from '../CONSTS'
import { sortPackageJson } from 'sort-package-json'
import { dependencyMap } from '../utils/dependencies'

function expressJSON(projectDir: string, packageManager: string) {
    fse.copySync(
        path.join(ROOT, 'template/applications/express'),
        path.join(projectDir, 'apps/express')
    )

    const pkgJSON = fse.readJSONSync(
        path.join(projectDir, 'apps/express/package.json')
    )

    // `node run dist/index.js` for other than bun.
    if (packageManager !== 'bun') {
        pkgJSON.scripts.start = 'node dist/index.js'
        pkgJSON.scripts.dev = 'tsup --watch --onSuccess "node dist/index.cjs"'

        pkgJSON.devDependencies['@types/node'] = dependencyMap['types/node']

        // pnpm workspaces fucks me everytime
        if (packageManager === 'pnpm') {
            pkgJSON.devDependencies['@repo/eslint-config'] = 'workspace:*'
            pkgJSON.devDependencies['@repo/typescript-config'] = 'workspace:*'
        }
    } else {
        pkgJSON.devDependencies['@types/bun'] = dependencyMap['types/bun']
    }

    const sortedPackageJSON = sortPackageJson(pkgJSON)
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

export { expressJSON }
