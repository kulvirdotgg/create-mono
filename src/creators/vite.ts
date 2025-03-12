import fse from 'fs-extra'
import path from 'node:path'

import { ROOT } from '@/CONSTS'
import { updateMonorepoPackagedependencies } from '@/utils/monorepo-packages-dependencies'

import type { TDependencies, TDevDependencies } from '@/utils/dependency-maps'
import { addDependencies } from '@/utils/add-dependencies'
import type { TInitOpts } from '@/utils/types'

function vite({ projectName, projectDir, packageManager }: TInitOpts) {
    const viteAppDir = path.join(projectDir, 'apps/vite')

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

    const packageJSON = fse.readJSONSync(path.join(viteAppDir, 'package.json'))
    packageJSON.name = `@${projectName}/vite`

    delete packageJSON.devDependencies['@repo/eslint']
    delete packageJSON.devDependencies['@repo/tsconfig']

    packageJSON.devDependencies[`@${projectName}/eslint`] = '*'
    packageJSON.devDependencies[`@${projectName}/tsconfig`] = '*'

    fse.writeJsonSync(path.join(viteAppDir, 'package.json'), packageJSON, {
        spaces: 4,
    })

    const tsconfig = fse.readJSONSync(path.join(viteAppDir, 'tsconfig.json'))
    tsconfig['extends'] = `@${projectName}/tsconfig/vite.json`
    fse.writeJsonSync(path.join(viteAppDir, 'tsconfig.json'), tsconfig, {
        spaces: 4,
    })

    if (packageManager === 'pnpm' || packageManager === 'bun') {
        updateMonorepoPackagedependencies(viteAppDir)
    }
}

export { vite }
