import fse from 'fs-extra'
import path from 'node:path'
import { sortPackageJson } from 'sort-package-json'

import { ROOT } from '@/CONSTS'
import { addDependencies } from '@/utils/add-dependencies'
import { updateWorkspacePkgs } from '@/utils/workspace-pkgs'
import type { TDependencies, TDevDependencies } from '@/utils/dependency-maps'
import type { TInitOpts } from '@/types'

function addDatabase({
    projectName,
    projectDir,
    packageManager,
    orm,
    database,
}: TInitOpts) {
    const dbPackagePath = path.join(projectDir, 'packages/database')

    fse.copySync(path.join(ROOT, 'template/database'), dbPackagePath)

    // copy orm specific files for the database
    fse.copySync(path.join(ROOT, `template/${orm}/${database}`), dbPackagePath)

    if (orm === 'drizzle') {
        const drizzleDeps: TDependencies[] = ['drizzle-orm', 'dotenv', 'zod']
        const drizzleDevDeps: TDevDependencies[] = [
            'drizzle-kit',
            'eslint',
            'drizzle-seed',
        ]

        if (database === 'postgres') {
            drizzleDeps.push('pg')
        } else {
            drizzleDeps.push('@libsql/client')
        }

        addDependencies(drizzleDeps, drizzleDevDeps, dbPackagePath)

        const packageJSON = fse.readJSONSync(
            path.join(dbPackagePath, 'package.json')
        )

        packageJSON.scripts['db:generate'] = 'drizzle-kit generate'
        packageJSON.scripts['db:migrate'] = 'drizzle-kit migrate'
        packageJSON.scripts['db:studio'] = 'drizzle-kit studio'

        packageJSON.exports['.'] = './src/index.ts'
        packageJSON.exports['./schema'] = './src/db/schema.ts'

        const sortedFile = sortPackageJson(packageJSON)

        fse.writeJSONSync(
            path.join(dbPackagePath, 'package.json'),
            sortedFile,
            {
                spaces: 4,
            }
        )
    } else if (orm === 'prisma') {
        const prismaDeps: TDependencies[] = ['@prisma/client', 'dotenv']
        const prismaDevDeps: TDevDependencies[] = ['prisma', 'eslint']

        if (packageManager === 'bun') {
            prismaDevDeps.push('@types/bun')
        } else {
            prismaDevDeps.push('@types/node')
        }

        addDependencies(prismaDeps, prismaDevDeps, dbPackagePath)

        const packageJSON = fse.readJSONSync(
            path.join(dbPackagePath, 'package.json')
        )

        packageJSON.scripts['db:deploy'] = 'prisma generate deploy'
        packageJSON.scripts['db:generate'] = 'prisma generate'
        packageJSON.scripts['db:studio'] = 'prisma studio'
        packageJSON.scripts['format'] = 'prisma format'

        packageJSON.exports['.'] = './src/index.ts'

        const sortedFile = sortPackageJson(packageJSON)

        fse.writeJSONSync(
            path.join(dbPackagePath, 'package.json'),
            sortedFile,
            {
                spaces: 4,
            }
        )
    }

    fse.renameSync(
        path.join(dbPackagePath, '_env'),
        path.join(dbPackagePath, '.env')
    )

    const packageJSON = fse.readJSONSync(
        path.join(dbPackagePath, 'package.json')
    )

    packageJSON.name = `@${projectName}/database`

    delete packageJSON.devDependencies['@repo/eslint']
    delete packageJSON.devDependencies['@repo/tsconfig']

    packageJSON.devDependencies[`@${projectName}/eslint`] = '*'
    packageJSON.devDependencies[`@${projectName}/tsconfig`] = '*'

    const sortedFile = sortPackageJson(packageJSON)
    fse.writeJsonSync(path.join(dbPackagePath, 'package.json'), sortedFile, {
        spaces: 4,
    })

    const tsconfig = fse.readJSONSync(path.join(dbPackagePath, 'tsconfig.json'))
    tsconfig['extends'] = `@${projectName}/tsconfig/base.json`
    fse.writeJsonSync(path.join(dbPackagePath, 'tsconfig.json'), tsconfig, {
        spaces: 4,
    })

    if (packageManager === 'pnpm' || packageManager === 'bun') {
        updateWorkspacePkgs(dbPackagePath)
    }
}

export { addDatabase }
