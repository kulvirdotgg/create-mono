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

    const deps: TDependencies[] = [
        'cors',
        'express',
        'express-winston',
        'winston',
        'zod',
    ]
    const devDeps: TDevDependencies[] = [
        '@types/cors',
        '@types/express',
        '@types/morgan',
        'eslint',
    ]

    if (packageManager === 'bun') {
        devDeps.push('@types/bun')
        addDependencies(deps, devDeps, expressDir)

        const packageJSON = fse.readJSONSync(
            path.join(expressDir, 'package.json')
        )

        // set bun specific scripts
        packageJSON.scripts['build'] =
            'bun build src/index.ts --outdir ./dist --target bun'
        packageJSON.scripts['dev'] = 'bun run --hot src/index.ts'
        packageJSON.scripts['start'] = 'bun dist/index.js'

        fse.writeJSONSync(path.join(expressDir, 'package.json'), packageJSON, {
            spaces: 4,
        })

        // because bun is bundler too
        // so we dont need tsup. BUN is a W.
        fse.remove(path.join(expressDir, 'tsup.config.ts'))
    } else {
        devDeps.push('@types/node', 'tsup')
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

        // Update tsup config to use correct database package name
        const tsupConfigPath = path.join(expressDir, 'tsup.config.ts')
        if (fse.existsSync(tsupConfigPath)) {
            const tsupConfig = fse.readFileSync(tsupConfigPath, 'utf8')
            const updatedTsupConfig = tsupConfig.replace(
                new RegExp('@repo/database', 'g'),
                `@${projectName}/database`
            )
            fse.writeFileSync(tsupConfigPath, updatedTsupConfig, 'utf8')
        }
    }

    const packageJSON = fse.readJSONSync(path.join(expressDir, 'package.json'))

    packageJSON.name = `@${projectName}/express-api`

    // change the workspace packages names
    // eg: @repo/eslint -> @monorepo-name/eslint
    delete packageJSON.devDependencies['@repo/eslint']
    delete packageJSON.devDependencies['@repo/tsconfig']

    packageJSON.devDependencies[`@${projectName}/eslint`] = '*'
    packageJSON.devDependencies[`@${projectName}/tsconfig`] = '*'
    packageJSON.dependencies[`@${projectName}/utils`] = '*'

    const sortedFile = sortPackageJson(packageJSON)

    fse.writeJsonSync(path.join(expressDir, 'package.json'), sortedFile, {
        spaces: 4,
    })

    const tsconfig = fse.readJSONSync(path.join(expressDir, 'tsconfig.json'))
    tsconfig['extends'] = `@${projectName}/tsconfig/base.json`
    fse.writeJsonSync(path.join(expressDir, 'tsconfig.json'), tsconfig, {
        spaces: 4,
    })

    // Replace @repo/utils with @projectName/utils in source files
    const envFile = fse.readFileSync(
        path.join(expressDir, 'src/env.ts'),
        'utf8'
    )
    const updatedEnvFile = envFile.replace(
        new RegExp('@repo/utils', 'g'),
        `@${projectName}/utils`
    )
    fse.writeFileSync(
        path.join(expressDir, 'src/env.ts'),
        updatedEnvFile,
        'utf8'
    )

    // Replace @repo/utils in logging.ts middleware
    const loggingFilePath = path.join(expressDir, 'src/middlewares/logging.ts')
    if (fse.existsSync(loggingFilePath)) {
        const loggingFile = fse.readFileSync(loggingFilePath, 'utf8')
        const updatedLoggingFile = loggingFile.replace(
            new RegExp('@repo/utils', 'g'),
            `@${projectName}/utils`
        )
        fse.writeFileSync(loggingFilePath, updatedLoggingFile, 'utf8')
    }

    // Create .env file (without DATABASE_URL if no database)
    const envTemplatePath = path.join(ROOT, 'template/applications/express/_env')
    if (fse.existsSync(envTemplatePath)) {
        fse.copyFileSync(
            envTemplatePath,
            path.join(expressDir, '.env')
        )
    }

    if (packageManager === 'pnpm' || packageManager === 'bun') {
        updateWorkspacePkgs(expressDir)
    }
}

export { addExpressApp }
