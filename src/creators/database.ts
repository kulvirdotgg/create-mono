import fse from 'fs-extra'
import path from 'node:path'

import { ROOT } from '@/CONSTS'
import { updateMonorepoPackagedependencies } from '@/utils/monorepo-packages-dependencies'

import type { TDatabase, TOrm, TPackageManager } from '@/cli'
import type { TDependencies, TDevDependencies } from '@/utils/dependency-maps'
import { addDependencies } from '@/utils/add-dependencies'
import { addExports, addScripts } from '@/utils/add-fields'

/*
 * TODO:
 * - setup a docker compose file to setup db
 **/

function addDatabase(
    projectDir: string,
    packageManager: TPackageManager,
    orm: TOrm,
    database: TDatabase
) {
    const dbPackagePath = path.join(projectDir, 'packages/database')

    fse.copySync(path.join(ROOT, 'template/database'), dbPackagePath)

    // TODO: handle no orm setup
    if (orm !== 'none') {
        fse.copySync(
            path.join(ROOT, `template/${orm}/${database}`),
            dbPackagePath
        )
    }

    // TODO: update the env file with proper db name

    switch (orm) {
        case 'drizzle':
            const drizzleDeps: TDependencies[] = [
                'drizzle-orm',
                'dotenv',
                'zod',
            ]
            const drizzleDevDeps: TDevDependencies[] = ['drizzle-kit', 'eslint']
            switch (database) {
                case 'postgres':
                    drizzleDeps.push('pg')
                    drizzleDevDeps.push('drizzle-seed')
                    break
                default:
                    drizzleDeps.push('@libsql/client')
                    break
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
        default:
            // TODO: to be implemented
            break
    }

    if (packageManager === 'pnpm' || packageManager === 'bun') {
        updateMonorepoPackagedependencies(dbPackagePath)
    }

    fse.renameSync(
        path.join(dbPackagePath, 'env'),
        path.join(dbPackagePath, '.env')
    )
}

export { addDatabase }
