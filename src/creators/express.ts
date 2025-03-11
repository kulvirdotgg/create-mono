import fse from 'fs-extra'
import path from 'node:path'

import { ROOT } from '@/CONSTS'
import {
    type TDependencies,
    type TDevDependencies,
} from '@/utils/dependency-maps'

import { updateMonorepoPackagedependencies } from '@/utils/monorepo-packages-dependencies'
import { addDependencies } from '@/utils/add-dependencies'
import { addScripts } from '@/utils/add-fields'
import type { TInitOpts } from '@/utils/types'

function addExpressApp({ projectName, projectDir, packageManager }: TInitOpts) {
    const expressDir = path.join(projectDir, 'apps/express')

    fse.copySync(path.join(ROOT, 'template/applications/express'), expressDir)

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

        addScripts(['express-bun-dev', 'express-bun-start'], expressDir)
    } else {
        devDeps.push('@types/node')
        addDependencies(deps, devDeps, expressDir)
        addScripts(['express-node-dev', 'express-node-start'], expressDir)
    }

    if (packageManager === 'pnpm' || packageManager === 'bun') {
        updateMonorepoPackagedependencies(expressDir)
    }
}

export { addExpressApp }
