import path from 'node:path'
import fse from 'fs-extra'
import { sortPackageJson } from 'sort-package-json'

import { addDependencies } from '../utils/add-dependencies'
import { TDependencies } from '../utils/dependencies'
import { ROOT } from '../CONSTS'

// appDir = repoName/apps/appName
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

    const packageJSON = fse.readJSONSync(path.join(appDir, 'package.json'))

    packageJSON.scripts['db:generate'] = 'drizzle-kit generate'
    packageJSON.scripts['db:migrate'] = 'drizzle-kit migrate '
    packageJSON.scripts['db:push'] = 'drizzle-kit push'
    packageJSON.scripts['db:studio'] = 'drizzle-kit studio'

    const sortedPackageJSON = sortPackageJson(packageJSON)
    fse.writeJSONSync(path.join(appDir, 'package.json'), sortedPackageJSON, {
        spaces: 4,
    })

    /*
        src
        |  drizzle
        |  |  db.ts
        |  |  schema.ts
        drizzle.connfig.ts
    */
    const depsDir = path.join(ROOT, 'template/deps')
    const drizzle = path.join(appDir, 'src/drizzle')
    fse.ensureDirSync(drizzle)

    fse.copyFileSync(
        path.join(depsDir, 'configs/drizzle.config.ts'),
        path.join(appDir, 'drizzle.config.ts')
    )

    fse.copyFileSync(
        path.join(depsDir, 'db/drizzle/schema.ts'),
        path.join(drizzle, 'schema.ts')
    )

    fse.copyFileSync(
        path.join(
            depsDir,
            'db/drizzle',
            dbProvider === 'neon' ? 'db-neon.ts' : 'db-supabase.ts'
        ),
        path.join(drizzle, 'db.ts')
    )
}

export { drizzleInstaller }
