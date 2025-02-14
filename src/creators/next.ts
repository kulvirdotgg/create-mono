import fse from 'fs-extra'
import path from 'node:path'

import { ROOT } from '@/CONSTS'
import { updateWorkspaceDependencies } from '@/utils/workspace-dependancy'

import type { TPackageManager } from '@/cli'

function next(projectDir: string, packageManager: TPackageManager) {
    // copy the Next template to user's machine
    fse.copySync(
        path.join(ROOT, 'template/applications/next'),
        path.join(projectDir, 'apps/next')
    )

    if (packageManager === 'pnpm' || packageManager === 'bun') {
        const appDir = path.join(projectDir, 'apps/next')
        updateWorkspaceDependencies(appDir)
    }
}

export { next }
