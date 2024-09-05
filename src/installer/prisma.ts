import path from 'node:path'
import fs from 'fs'
import fse from 'fs-extra'

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
    }
    addDependencies(pkg, false, appDir)

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
    const prismaDir = path.join(appDir, 'src/prisma')
    fse.ensureDir(prismaDir)

    // db-conn
    fs.copyFileSync(
        path.join(
            depsDir,
            'db/prisma',
            dbProvider === 'neon' ? 'db-neon.ts' : 'db-supabase.ts',
        ),
        path.join(prismaDir, 'db.ts'),
    )
}

export { prismaInstaller }
