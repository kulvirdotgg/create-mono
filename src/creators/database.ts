import fse from 'fs-extra'
import path from 'node:path'

import { ROOT } from '@/CONSTS'
import { updateMonorepoPackagedependencies } from '@/utils/monorepo-packages-dependencies'

import type { TDatabase, TOrm, TPackageManager } from '@/cli'

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
    // path where database package will be located in monorepo
    // `repo/packages/database`
    const dbPackagePath = path.join(projectDir, 'packages/database')

    // Copy neccessary files like `package.json` and `tsconfig.json`.....
    fse.copySync(path.join(ROOT, 'template/database'), dbPackagePath)

    // TODO: handle no orm setup
    if (orm !== 'none') {
        fse.copySync(
            path.join(ROOT, `template/${orm}/${database}`),
            dbPackagePath
        )
    }

    /*
     * TODO:
     * - construct package.json with dependencies
     * - update the env file with appropriate variables
     * - update the env file with proper db name
     **/

    const packageJSON = fse.readJSONSync(
        path.resolve(dbPackagePath, 'package.json')
    )
    switch (orm) {
        case 'drizzle':
            if (database === 'sqlite') {
                // TODO: create a db file tooo.... idk but yeah
            }
            break
        case 'prisma':
            break
        default:
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
