import fse from 'fs-extra'
import path from 'node:path'

import { ROOT } from '@/CONSTS'
import { updateMonorepoPackagedependencies } from '@/utils/monorepo-packages-dependencies'

import { addDependencies } from '@/utils/add-dependencies'
import { addExports, addScripts } from '@/utils/add-fields'
import type { TInitOpts } from '@/utils/types'
import type { TDependencies, TDevDependencies } from '@/utils/dependency-maps'

function addDatabase({
    projectName,
    projectDir,
    packageManager,
    orm,
    database,
}: TInitOpts) {
    const dbPackagePath = path.join(projectDir, 'packages/database')

    fse.copySync(path.join(ROOT, 'template/database'), dbPackagePath)

    fse.copySync(path.join(ROOT, `template/${orm}/${database}`), dbPackagePath)

    // TODO: update the env file with proper db name

    switch (orm) {
        case 'drizzle':
            const drizzleDeps: TDependencies[] = [
                'drizzle-orm',
                'dotenv',
                'zod',
            ]
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

            addExports(['drizzle-db', 'drizzle-schema'], dbPackagePath)

            addScripts(
                ['drizzle-generate', 'drizzle-migrate', 'drizzle-studio'],
                dbPackagePath
            )
            break
        case 'prisma':
            const prismaDeps: TDependencies[] = ['@prisma/client', 'dotenv']
            const prismaDevDeps: TDevDependencies[] = ['prisma', 'eslint']

            if (packageManager === 'bun') {
                prismaDevDeps.push('@types/bun')
            } else {
                prismaDevDeps.push('@types/node')
            }
            addDependencies(prismaDeps, prismaDevDeps, dbPackagePath)

            addExports(['prisma'], dbPackagePath)

            addScripts(
                [
                    'prisma-generate',
                    'prisma-migrate',
                    'prisma-deploy',
                    'prisma-studio',
                    'prisma-format',
                ],
                dbPackagePath
            )
            break
    }

    if (packageManager === 'pnpm' || packageManager === 'bun') {
        updateMonorepoPackagedependencies(dbPackagePath)
    }

    fse.renameSync(
        path.join(dbPackagePath, 'env'),
        path.join(dbPackagePath, '.env')
    )

    const packageJSON = fse.readJSONSync(
        path.join(dbPackagePath, 'package.json')
    )
    packageJSON.name = `@${projectName}/database`

    fse.writeJsonSync(path.join(dbPackagePath, 'package.json'), packageJSON, {
        spaces: 4,
    })
}

export { addDatabase }
