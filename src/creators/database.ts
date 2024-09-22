import fse from 'fs-extra'
import path from 'node:path'

import { ROOT } from '@/CONSTS'
import { addDependencies } from '@/utils/add-dependencies'
import { updatePnpmWorkspace } from '@/utils/workspace-pnpm'

import type { TDatabase, TPackage, TPackageManager } from '@/cli/index'
import type { TDependencies } from '@/utils/dependencies'
import { updateTurboPkgJSON } from '@/utils/update-turbo-pkg'

function addDatabase(
    projectDir: string,
    packageManager: TPackageManager,
    pkg: TPackage,
    database: TDatabase
) {
    // Put in library eslint config in `@repo/eslint-config`
    fse.copyFileSync(
        path.join(ROOT, 'template/packages/eslint/library.cjs'),
        path.join(projectDir, 'packages/eslint-config/library.cjs')
    )

    const dbTemplate = path.join(ROOT, 'template/packages/databases')
    let dbPackage = ''

    if (pkg === 'prisma') {
        dbPackage = path.join(projectDir, 'packages/prisma-config')
        fse.ensureDirSync(dbPackage)

        fse.copySync(path.join(dbTemplate, 'prisma'), dbPackage)
        fse.copyFileSync(
            path.join(
                ROOT,
                'template/prisma',
                database === 'neon' ? 'db-neon.ts' : 'db-supabase.ts'
            ),
            path.join(dbPackage, 'src/db.ts')
        )

        // Prisma specific dependencies
        const devDependencies: TDependencies[] = ['prisma']
        addDependencies(devDependencies, true, dbPackage)

        const pkg: TDependencies[] = ['@prisma/client']
        if (database === 'neon') {
            pkg.push('@prisma/adapter-neon')
            pkg.push('@neondatabase/serverless')
        }
        addDependencies(pkg, false, dbPackage)

        updateTurboPkgJSON(projectDir, 'prisma')
    } else if (pkg === 'drizzle') {
        dbPackage = path.join(projectDir, 'packages/drizzle-config')

        fse.ensureDirSync(dbPackage)

        fse.copySync(path.join(dbTemplate, 'drizzle'), dbPackage)
        fse.copyFileSync(
            path.join(
                ROOT,
                'template/drizzle',
                database === 'neon' ? 'db-neon.ts' : 'db-supabase.ts'
            ),
            path.join(dbPackage, 'src/db.ts')
        )

        // drizzle specific dependencies
        const devDependencies: TDependencies[] = ['drizzle-kit']
        addDependencies(devDependencies, true, dbPackage)

        const dependencies: TDependencies[] = ['drizzle-orm']
        if (database === 'neon') {
            dependencies.push('@neondatabase/serverless')
        } else if (database === 'supabase') {
            dependencies.push('postgres')
        }
        addDependencies(dependencies, false, dbPackage)

        updateTurboPkgJSON(projectDir, 'drizzle')
    }

    // pnpm workspace thingie... idk its annoying
    if (packageManager === 'pnpm') {
        const appDir = dbPackage
        updatePnpmWorkspace(appDir)
    }

    fse.renameSync(path.join(dbPackage, 'env'), path.join(dbPackage, '.env'))
    fse.renameSync(
        path.join(dbPackage, 'eslintrc.cjs'),
        path.join(dbPackage, '.eslintrc.cjs')
    )
}

export { addDatabase }
