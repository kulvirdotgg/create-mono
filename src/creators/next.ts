import fse from 'fs-extra'
import path from 'node:path'

import { ROOT } from '@/CONSTS'
import { updateMonorepoPackagedependencies } from '@/utils/monorepo-packages-dependencies'

import type { TDependencies, TDevDependencies } from '@/utils/dependency-maps'
import { addDependencies } from '@/utils/add-dependencies'
import type { TInitOpts } from '@/utils/types'

function next({ projectName, projectDir, packageManager }: TInitOpts) {
    const nextAppDir = path.join(projectDir, 'apps/next')

    fse.copySync(path.join(ROOT, 'template/applications/next'), nextAppDir)

    const deps: TDependencies[] = ['react', 'react-dom', 'next']
    const devDeps: TDevDependencies[] = [
        '@types/node',
        '@types/react',
        '@types/react-dom',
        'eslint',
    ]
    addDependencies(deps, devDeps, nextAppDir)

    if (packageManager === 'pnpm' || packageManager === 'bun') {
        updateMonorepoPackagedependencies(nextAppDir)
    }

    const packageJSON = fse.readJSONSync(path.join(nextAppDir, 'package.json'))
    packageJSON.name = `@${projectName}/next`

    fse.writeJsonSync(path.join(nextAppDir, 'package.json'), packageJSON, {
        spaces: 4,
    })
}

export { next }
