import fse from 'fs-extra'
import path from 'node:path'

import { ROOT } from '@/CONSTS'
import { updateMonorepoPackagedependencies } from '@/utils/monorepo-packages-dependencies'

import type { TPackageManager } from '@/cli'
import type { TDependencies, TDevDependencies } from '@/utils/dependency-maps'
import { addDependencies } from '@/utils/add-dependencies'

function next(projectDir: string, packageManager: TPackageManager) {
    const nextAppDir = path.join(projectDir, 'apps/next')

    // copy the Next template to user's machine
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
}

export { next }
