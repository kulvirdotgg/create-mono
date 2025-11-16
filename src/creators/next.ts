import fse from 'fs-extra'
import path from 'node:path'
import { sortPackageJson } from 'sort-package-json'

import { ROOT } from '@/CONSTS'
import { updateWorkspacePkgs } from '@/utils/workspace-pkgs'
import type { TDependencies, TDevDependencies } from '@/utils/dependency-maps'
import { addDependencies } from '@/utils/add-dependencies'
import type { TInitOpts } from '@/types'

function next({ projectName, projectDir, packageManager }: TInitOpts) {
    const nextAppDir = path.join(projectDir, 'apps/next')

    fse.copySync(path.join(ROOT, 'template/applications/next'), nextAppDir)

    const deps: TDependencies[] = ['react', 'react-dom', 'next', 'zod']
    const devDeps: TDevDependencies[] = [
        '@types/node',
        '@types/react',
        '@types/react-dom',
        'eslint',
    ]
    addDependencies(deps, devDeps, nextAppDir)

    const packageJSON = fse.readJSONSync(path.join(nextAppDir, 'package.json'))

    packageJSON.name = `@${projectName}/next`

    delete packageJSON.devDependencies['@repo/eslint']
    delete packageJSON.devDependencies['@repo/tsconfig']

    packageJSON.devDependencies[`@${projectName}/eslint`] = '*'
    packageJSON.devDependencies[`@${projectName}/tsconfig`] = '*'
    packageJSON.dependencies[`@${projectName}/utils`] = '*'

    const sortedFile = sortPackageJson(packageJSON)

    fse.writeJsonSync(path.join(nextAppDir, 'package.json'), sortedFile, {
        spaces: 4,
    })

    const tsconfig = fse.readJSONSync(path.join(nextAppDir, 'tsconfig.json'))
    tsconfig['extends'] = `@${projectName}/tsconfig/next.json`
    fse.writeJsonSync(path.join(nextAppDir, 'tsconfig.json'), tsconfig, {
        spaces: 4,
    })

    if (packageManager === 'pnpm' || packageManager === 'bun') {
        updateWorkspacePkgs(nextAppDir)
    }
}

export { next }
