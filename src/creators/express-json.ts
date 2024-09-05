import fs from 'fs'
import fse from 'fs-extra'
import path from 'node:path'

import { ROOT } from '../CONSTS'

function expressJSON(projectDir: string, packageManager: string) {
    fse.copySync(
        path.join(ROOT, 'template/applications/express'),
        path.join(projectDir, 'apps/express'),
    )

    const pkgJSON = fse.readJSONSync(
        path.join(projectDir, 'apps/express/package.json'),
    )

    // `node run dist/index.js` for other than bun.
    if (packageManager !== 'bun') {
        pkgJSON.scripts.start = 'node dist/index.js'
        pkgJSON.scripts.dev = 'tsup --watch --onSuccess "node dist/index.js"'

        // pnpm workspaces fucks me everytime
        if (packageManager === 'pnpm') {
            pkgJSON.devDependencies['@repo/eslint-config'] = 'workspace:*'
            pkgJSON.devDependencies['@repo/typescript-config'] = 'workspace:*'
        }
    }

    fse.writeJsonSync(
        path.join(projectDir, 'apps/express/package.json'),
        pkgJSON,
        {
            spaces: 4,
        },
    )

    fs.copyFileSync(
        path.join(ROOT, 'template/deps/eslint/server.js'),
        path.join(projectDir, 'packages/eslint-config/server.js'),
    )
}

export { expressJSON }
