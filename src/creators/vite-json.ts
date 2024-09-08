import fs from 'fs'
import fse from 'fs-extra'
import path from 'node:path'

import { ROOT } from '../CONSTS'

function viteJSON(projectDir: string, packageManager: string) {
    fse.copySync(
        path.join(ROOT, 'template/applications/vite'),
        path.join(projectDir, 'apps/vite')
    )

    // pnpm workspaces fucks everytime
    if (packageManager === 'pnpm') {
        const pkgJSON = fse.readJSONSync(
            path.join(projectDir, 'apps/vite/package.json')
        )

        pkgJSON.devDependencies['@repo/eslint-config'] = 'workspace:*'
        pkgJSON.devDependencies['@repo/typescript-config'] = 'workspace:*'

        fse.writeJsonSync(
            path.join(projectDir, 'apps/vite/package.json'),
            pkgJSON,
            {
                spaces: 4,
            }
        )
    }

    fs.copyFileSync(
        path.join(ROOT, 'template/deps/eslint/vite.cjs'),
        path.join(projectDir, 'packages/eslint-config/vite.cjs')
    )
    fs.copyFileSync(
        path.join(ROOT, 'template/deps/tsconfig/vite.json'),
        path.join(projectDir, 'packages/typescript-config/vite.json')
    )
}

export { viteJSON }
