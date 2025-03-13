import fse from 'fs-extra'
import path from 'node:path'
import { sortPackageJson } from 'sort-package-json'

import { ROOT } from '@/CONSTS'
import { updateWorkspacePkgs } from '@/utils/workspace-pkgs'
import type { TDependencies, TDevDependencies } from '@/utils/dependency-maps'
import { addDependencies } from '@/utils/add-dependencies'
import type { TInitOpts } from '@/types'

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

    const sortedFile = sortPackageJson(packageJSON)

    fse.writeJsonSync(path.join(viteAppDir, 'package.json'), sortedFile, {
        spaces: 4,
    })

    const tsconfig = fse.readJSONSync(path.join(viteAppDir, 'tsconfig.json'))
    tsconfig['extends'] = `@${projectName}/tsconfig/vite.json`
    fse.writeJsonSync(path.join(viteAppDir, 'tsconfig.json'), tsconfig, {
        spaces: 4,
    })

    if (packageManager === 'pnpm' || packageManager === 'bun') {
        updateWorkspacePkgs(viteAppDir)
    }
}

export { vite }
