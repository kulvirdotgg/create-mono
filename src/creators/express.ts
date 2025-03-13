import fse from 'fs-extra'
import path from 'node:path'
import { sortPackageJson } from 'sort-package-json'

import { ROOT } from '@/CONSTS'
import { addDependencies } from '@/utils/add-dependencies'
import { updateWorkspacePkgs } from '@/utils/workspace-pkgs'
import type { TInitOpts } from '@/types'
import {
    type TDependencies,
    type TDevDependencies,
} from '@/utils/dependency-maps'

function addExpressApp({ projectName, projectDir, packageManager }: TInitOpts) {
    const expressDir = path.join(projectDir, 'apps/express')

    // copy over the express template
    fse.copySync(path.join(ROOT, 'template/applications/express'), expressDir)

    const deps: TDependencies[] = ['cors', 'dotenv', 'express', 'morgan', 'zod']
    const devDeps: TDevDependencies[] = [
        '@types/cors',
        '@types/express',
        '@types/morgan',
        'eslint',
        'tsup',
    ]

    if (packageManager === 'bun') {
        devDeps.push('@types/bun')
        addDependencies(deps, devDeps, expressDir)

        const packageJSON = fse.readJSONSync(
            path.join(expressDir, 'package.json')
        )

        // set bun specific scripts
        packageJSON.scripts['dev'] =
            'tsup --watch --onSuccess "bun dist/index.js"'
        packageJSON.scripts['start'] = 'bun dist/index.js'

        fse.writeJSONSync(path.join(expressDir, 'package.json'), packageJSON, {
            spaces: 4,
        })
    } else {
        devDeps.push('@types/node')
        addDependencies(deps, devDeps, expressDir)

        const packageJSON = fse.readJSONSync(
            path.join(expressDir, 'package.json')
        )

        // set node specific scripts
        packageJSON.scripts['dev'] =
            'tsup --watch --onSuccess "node dist/index.js"'
        packageJSON.scripts['start'] = 'node dist/index.js'

        fse.writeJSONSync(path.join(expressDir, 'package.json'), packageJSON, {
            spaces: 4,
        })
    }

    const packageJSON = fse.readJSONSync(path.join(expressDir, 'package.json'))

    packageJSON.name = `@${projectName}/express-api`

    // change the workspace packages names
    // eg: @repo/eslint -> @monorepo-name/eslint
    delete packageJSON.devDependencies['@repo/eslint']
    delete packageJSON.devDependencies['@repo/tsconfig']

    packageJSON.devDependencies[`@${projectName}/eslint`] = '*'
    packageJSON.devDependencies[`@${projectName}/tsconfig`] = '*'

    const sortedFile = sortPackageJson(packageJSON)

    fse.writeJsonSync(path.join(expressDir, 'package.json'), sortedFile, {
        spaces: 4,
    })

    const tsconfig = fse.readJSONSync(path.join(expressDir, 'tsconfig.json'))
    tsconfig['extends'] = `@${projectName}/tsconfig/base.json`
    fse.writeJsonSync(path.join(expressDir, 'tsconfig.json'), tsconfig, {
        spaces: 4,
    })

    if (packageManager === 'pnpm' || packageManager === 'bun') {
        updateWorkspacePkgs(expressDir)
    }
}

export { addExpressApp }
