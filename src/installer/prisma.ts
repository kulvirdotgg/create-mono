import path from 'node:path'
import fse from 'fs-extra'
import { sortPackageJson } from 'sort-package-json'

import { addDependencies } from '../utils/add-dependencies'
import type { TDependencies } from '../utils/dependencies'
import { ROOT } from '../CONSTS'

// appDir = repoName/apps/appName
function prismaInstaller(appDir: string, dbProvider: string) {
    const devPkg: TDependencies[] = ['prisma']
    addDependencies(devPkg, true, appDir)

    const pkg: TDependencies[] = ['@prisma/client']
    if (dbProvider === 'neon') {
        pkg.push('@prisma/adapter-neon')
        pkg.push('@neondatabase/serverless')
    }
    addDependencies(pkg, false, appDir)

    // add ORM scripts
    const packageJSON = fse.readJSONSync(path.join(appDir, 'package.json'))
    packageJSON.scripts['db:generate'] = 'prisma migrate dev'
    packageJSON.scripts['db:migrate'] = 'prisma migrate deploy'
    packageJSON.scripts['db:push'] = 'prisma db push'
    packageJSON.scripts['db:studio'] = 'prisma studio'

    const sortedPackageJSON = sortPackageJson(packageJSON)
    fse.writeJSONSync(path.join(appDir, 'package.json'), sortedPackageJSON, {
        spaces: 4,
    })

    /*
    prisma
    |  schema.prisma
    src
    |  prisma 
    |  |  db.ts
    */

    const depsDir = path.join(ROOT, 'template/deps')

    fse.copySync(path.join(depsDir, 'prisma'), path.join(appDir, 'prisma'))

    // create the prisma directory first inside src
    const prisma = path.join(appDir, 'src/prisma')
    fse.ensureDir(prisma)
        .then(() => {
            fse.copySync(
                path.join(
                    depsDir,
                    'db/prisma',
                    dbProvider === 'neon' ? 'db-neon.ts' : 'db-supabase.ts'
                ),
                path.join(prisma, 'db.ts')
            )
        })
        .catch((err) => {
            console.log('error in installing prisma', err)
        })
}

export { prismaInstaller }
