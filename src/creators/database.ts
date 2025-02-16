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
            const deps: TDependencies[] = ['drizzle-orm', 'dotenv', 'zod']
            const devDeps: TDevDependencies[] = ['drizzle-kit', 'eslint']
            switch (database) {
                case 'postgres':
                    deps.push('pg')
                    devDeps.push('drizzle-seed')
                    break
                default:
                    deps.push('@libsql/client')
                    break
            }

            addDependencies(deps, devDeps, dbPackagePath)

            addExports(['drizzle-db', 'drizzle-schema'], dbPackagePath)

            addScripts(
                ['drizzle-generate', 'drizzle-migrate', 'drizzle-studio'],
                dbPackagePath
            )
            break
        case 'prisma':
            // TODO: to be implemented
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
