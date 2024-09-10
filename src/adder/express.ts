import path from 'node:path'
import fse from 'fs-extra'

import type { TExpress } from '../cli/deps'
import { drizzleInstaller } from '../installer/drizzle'
import { prismaInstaller } from '../installer/prisma'
import { ROOT } from '../CONSTS'

function addExpressDependencies(appDir: string, express: TExpress) {
    const configsDir = path.join(ROOT, 'template/deps/configs')

    if (express?.database === 'none') {
        fse.copyFileSync(
            path.join(configsDir, 'env'),
            path.join(appDir, '.env')
        )
        fse.copyFileSync(
            path.join(configsDir, 'env-example'),
            path.join(appDir, '.env.example')
        )
        return
    }

    fse.copyFileSync(path.join(configsDir, 'env-db'), path.join(appDir, '.env'))
    fse.copyFileSync(
        path.join(configsDir, 'env-db-example'),
        path.join(appDir, '.env.example')
    )

    const orm = express?.orm
    const dbProvider = express?.database!

    if (orm === 'drizzle') {
        drizzleInstaller(appDir, dbProvider)
    } else if (orm === 'prisma') {
        prismaInstaller(appDir, dbProvider)
    }
}

export { addExpressDependencies }
