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

    // sqlite doesn't need any docker compose file.
    if (database === 'mysql' || database === 'postgresql') {
        let dockerFile = fse.readFileSync(
            path.join(ROOT, `template/docker/${database}.yaml`),
            'utf-8'
        )
        dockerFile = dockerFile.replaceAll('test', projectName)

        fse.writeFileSync(
            path.join(projectDir, 'docker-compose.yaml'),
            dockerFile
        )
    }

    if (orm === 'drizzle') {
        fse.copySync(
            path.join(ROOT, `template/drizzle/${database}`),
            dbPackagePath
        )

        const drizzleDeps: TDependencies[] = ['drizzle-orm', 'dotenv', 'zod']
        const drizzleDevDeps: TDevDependencies[] = [
            'drizzle-kit',
            'eslint',
            'drizzle-seed',
            'tsx',
        ]

        switch (database) {
            case 'postgresql': {
                drizzleDeps.push('pg')
                break
            }
            case 'sqlite': {
                drizzleDeps.push('@libsql/client')
                break
            }
            case 'mysql': {
                drizzleDeps.push('mysql2')
            }
        }

        addDependencies(drizzleDeps, drizzleDevDeps, dbPackagePath)

        const packageJSON = fse.readJSONSync(
            path.join(dbPackagePath, 'package.json')
        )

        packageJSON.scripts['db:generate'] = 'drizzle-kit generate'
        packageJSON.scripts['db:migrate'] = 'drizzle-kit migrate'
        packageJSON.scripts['db:push'] = 'drizzle-kit push'
        packageJSON.scripts['db:studio'] = 'drizzle-kit studio'
        packageJSON.scripts['db:seed'] = 'tsx src/seed.ts'

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
        fse.copySync(path.join(ROOT, 'template/prisma'), dbPackagePath)

        // Update the database provider in `schema.prisma` file
        const schemaFileLoc = path.join(dbPackagePath, 'prisma/schema.prisma')

        const schemaFile = fse.readFileSync(schemaFileLoc, 'utf8')

        const updatedFile = schemaFile.replace(
            new RegExp('postgresql', 'g'),
            database!
        )
        fse.writeFileSync(schemaFileLoc, updatedFile, 'utf8')

        const prismaDeps: TDependencies[] = ['@prisma/client', 'dotenv']
        const prismaDevDeps: TDevDependencies[] = ['prisma', 'eslint', 'tsx']

        if (packageManager === 'bun') {
            prismaDevDeps.push('@types/bun')
        } else {
            prismaDevDeps.push('@types/node')
        }

        addDependencies(prismaDeps, prismaDevDeps, dbPackagePath)

        const packageJSON = fse.readJSONSync(
            path.join(dbPackagePath, 'package.json')
        )

        packageJSON.scripts['db:deploy'] = 'prisma migrate deploy'
        packageJSON.scripts['db:generate'] = 'prisma generate'
        packageJSON.scripts['db:migrate'] = 'prisma migrate dev --skip-generate'
        packageJSON.scripts['db:studio'] = 'prisma studio'
        packageJSON.scripts['db:seed'] = 'tsx src/seed.ts'
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
