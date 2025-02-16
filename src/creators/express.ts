import fse from 'fs-extra'
import path from 'node:path'
import { sortPackageJson } from 'sort-package-json'

import { ROOT } from '@/CONSTS'
import {
    devDependencyMap,
    type TDependencies,
    type TDevDependencies,
} from '@/utils/dependency-maps'

import type { TPackageManager } from '@/cli'
import { updateMonorepoPackagedependencies } from '@/utils/monorepo-packages-dependencies'
import { addDependencies } from '@/utils/add-dependencies'

function addExpressApp(projectDir: string, packageManager: TPackageManager) {
    const expressDir = path.join(projectDir, 'apps/express')

    // copy the Express template to user's machine
    fse.copySync(path.join(ROOT, 'template/applications/express'), expressDir)

    const packageJSON = fse.readJSONSync(path.join(expressDir, 'package.json'))

    const deps: TDependencies[] = ['cors', 'dotenv', 'express', 'morgan', 'zod']
    const devDeps: TDevDependencies[] = [
        '@types/cors',
        '@types/express',
        '@types/morgan',
        'eslint',
        'tsup',
    ]
    if (packageManager === 'bun') {
        devDeps.push('@types/bun')
        addDependencies(deps, devDeps, expressDir)

        packageJSON.scripts.start = 'bun dist/index.js'
        packageJSON.scripts.dev = 'tsup --watch --onSuccess "bun dist/index.js"'
    } else {
        devDeps.push('@types/node')
        addDependencies(deps, devDeps, expressDir)
    }

    const sortedPackageJSON = sortPackageJson(packageJSON)
    fse.writeJsonSync(
        path.join(expressDir, 'package.json'),
        sortedPackageJSON,
        {
            spaces: 4,
        }
    )

    if (packageManager === 'pnpm' || packageManager === 'bun') {
        updateMonorepoPackagedependencies(expressDir)
    }
}

export { addExpressApp }
