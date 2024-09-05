import path from 'node:path'
import fs from 'fs'
import fse from 'fs-extra'

import { addDependencies } from '../utils/add-dependencies'
import { TDependencies } from '../utils/dependencies'
import { ROOT } from '../CONSTS'

function drizzleInstaller(appDir: string, dbProvider: string) {
    const devPkg: TDependencies[] = ['drizzle-kit']
    addDependencies(devPkg, true, appDir)

    const pkg: TDependencies[] = ['drizzle-orm']
    if (dbProvider === 'neon') {
        pkg.push('@neondatabase/serverless')
    } else if (dbProvider === 'supabase') {
        pkg.push('postgres')
    }
    addDependencies(pkg, false, appDir)

    /*
    src
    |  drizzle
    |  |  db.ts
    |  |  schema.ts
    drizzle.connfig.ts
    */

    const depsDir = path.join(ROOT, 'template/deps')

    // create the drizzle directory first inside src
    const drizzleDir = path.join(appDir, 'src/drizzle')
    fse.ensureDir(drizzleDir)

    // drizzle config
    fs.copyFileSync(
        path.join(depsDir, 'configs/drizzle.config.ts'),
        path.join(appDir, 'drizzle.config.ts'),
    )

    // schema
    fs.copyFileSync(
        path.join(depsDir, 'db/drizzle/schema.ts'),
        path.join(drizzleDir, 'schema.ts'),
    )

    // db-conn
    fs.copyFileSync(
        path.join(
            depsDir,
            'db/drizzle',
            dbProvider === 'neon' ? 'db-neon.ts' : 'db-supabase.ts',
        ),
        path.join(drizzleDir, 'db.ts'),
    )
}

export { drizzleInstaller }
