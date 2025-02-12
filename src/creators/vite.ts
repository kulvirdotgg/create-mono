import fse from 'fs-extra'
import path from 'node:path'

import { ROOT } from '@/CONSTS'
import { updatePnpmWorkspace } from '@/utils/workspace-pnpm'

import type { TPackageManager } from '@/cli'

function vite(projectDir: string, packageManager: TPackageManager) {
    fse.copySync(
        path.join(ROOT, 'template/applications/vite'),
        path.join(projectDir, 'apps/vite')
    )

    // pnpm workspaces fucks me everytime
    if (packageManager === 'pnpm') {
        const appDir = path.join(projectDir, 'apps/vite')

        updatePnpmWorkspace(appDir)
    }
}

export { vite }
