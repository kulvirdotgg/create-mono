import path from 'node:path'

import { addExpressDependencies } from './express'
import type { TExpress, TVite } from '../cli/deps'

async function addAppDeps(projectDir: string, express: TExpress, vite: TVite) {
    const appDir = path.join(projectDir, 'apps/express')

    if (express !== null) {
        addExpressDependencies(appDir, express)
    }
}

export { addAppDeps }
