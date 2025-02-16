import fse from 'fs-extra'
import path from 'node:path'

import { ROOT } from '@/CONSTS'
import { updateMonorepoPackagedependencies } from '@/utils/monorepo-packages-dependencies'

import type { TPackageManager } from '@/cli'
import type { TDependencies, TDevDependencies } from '@/utils/dependency-maps'
import { addDependencies } from '@/utils/add-dependencies'

function vite(projectDir: string, packageManager: TPackageManager) {
    const viteAppDir = path.join(projectDir, 'apps/vite')

    // copy the Vite template to user's machine
    fse.copySync(path.join(ROOT, 'template/applications/vite'), viteAppDir)

    const deps: TDependencies[] = ['react', 'react-dom']
    const devDeps: TDevDependencies[] = [
        '@types/react',
        '@types/react-dom',
        '@vitejs/plugin-react',
        'eslint',
        'vite',
    ]
    addDependencies(deps, devDeps, viteAppDir)

    if (packageManager === 'pnpm' || packageManager === 'bun') {
        updateMonorepoPackagedependencies(viteAppDir)
    }
}

export { vite }
