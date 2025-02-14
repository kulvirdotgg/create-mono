import path from 'path'
import fse from 'fs-extra'

import { ROOT } from '@/CONSTS'
import { baseSetup } from './base-setup'
import { express } from './express'
import { vite } from './vite'
import { addDatabase } from './database'

import type {
    TApplication,
    TDatabase,
    TOrm,
    TPackageManager,
} from '@/cli/index'
import { next } from './next'

async function init(
    projectName: string,
    packageManager: TPackageManager,
    applications: TApplication[],
    orm: TOrm,
    database: TDatabase
) {
    // absolute path for the project
    const projectDir = path.resolve(process.cwd(), projectName)

    await baseSetup(projectName, projectDir)

    if (packageManager === 'pnpm') {
        // copy over the pnpm workspaces file for monorepo setup
        fse.copyFileSync(
            path.join(ROOT, 'template/pnpm-workspace.yaml'),
            path.join(projectDir, 'pnpm-workspace.yaml')
        )
    } else {
        // if package manager is anything except pnpm
        // set workspaces key in `package.json`
        const packageJSON = fse.readJSONSync(
            path.resolve(projectDir, 'package.json')
        )
        packageJSON['workspaces'].push('apps/*', 'packages/*', 'tooling/*')
        fse.writeJsonSync(path.join(projectDir, 'package.json'), packageJSON, {
            spaces: 4,
        })
    }

    if (applications.includes('vite')) {
        vite(projectDir, packageManager)
    }

    if (applications.includes('express')) {
        express(projectDir, packageManager)
    }

    if (applications.includes('next')) {
        next(projectDir, packageManager)
    }

    // orm !== 'none' && addDatabase(projectDir, packageManager, orm, database)
}

export { init }
