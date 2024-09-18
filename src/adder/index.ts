import path from 'node:path'

import { addExpressDependencies } from './express'
import type { TExpress, TVite } from '../cli/deps'
import { addViteDependencies } from './vite'

async function addAppDeps(projectDir: string, express: TExpress, vite: TVite) {
    if (express !== null) {
        const expressDir = path.join(projectDir, 'apps/express')
        addExpressDependencies(expressDir, express)
    }

    if (vite !== null) {
        const viteDir = path.join(projectDir, 'apps/vite')
        addViteDependencies(viteDir, vite)
    }
}

export { addAppDeps }
