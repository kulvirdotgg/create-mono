import fse from 'fs-extra'
import path from 'node:path'

import { ROOT } from '@/CONSTS'
import { updateMonorepoPackagedependencies } from '@/utils/monorepo-packages-dependencies'

import type { TPackageManager } from '@/cli'

function vite(projectDir: string, packageManager: TPackageManager) {
    const viteAppDir = path.join(projectDir, 'apps/vite')

    // copy the Vite template to user's machine
    fse.copySync(path.join(ROOT, 'template/applications/vite'), viteAppDir)

    if (packageManager === 'pnpm' || packageManager === 'bun') {
        updateMonorepoPackagedependencies(viteAppDir)
    }
}

export { vite }
