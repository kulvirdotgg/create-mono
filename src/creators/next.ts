import fse from 'fs-extra'
import path from 'node:path'

import { ROOT } from '@/CONSTS'
import { updateMonorepoPackagedependencies } from '@/utils/monorepo-packages-dependencies'

import type { TPackageManager } from '@/cli'

function next(projectDir: string, packageManager: TPackageManager) {
    const nextAppDir = path.join(projectDir, 'apps/next')

    // copy the Next template to user's machine
    fse.copySync(path.join(ROOT, 'template/applications/next'), nextAppDir)

    if (packageManager === 'pnpm' || packageManager === 'bun') {
        updateMonorepoPackagedependencies(nextAppDir)
    }
}

export { next }
