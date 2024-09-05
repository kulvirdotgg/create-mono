import type { TExpress } from '../cli/deps'
import { drizzleInstaller } from '../installer/drizzle'
import { prismaInstaller } from '../installer/prisma'

function addExpressDependencies(appDir: string, express: TExpress) {
    if (express?.database === 'none') {
        return
    }

    const orm = express?.orm
    const dbProvider = express?.database!

    if (orm === 'drizzle') {
        drizzleInstaller(appDir, dbProvider)
    } else if (orm === 'prisma') {
        prismaInstaller(appDir, dbProvider)
    }
}

export { addExpressDependencies }
