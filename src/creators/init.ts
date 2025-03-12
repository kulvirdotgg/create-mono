import fse from 'fs-extra'
import path from 'path'

import { baseSetup } from './base-setup'
import { addDatabase } from './database'
import { addExpressApp } from './express'
import { next } from './next'
import { vite } from './vite'
import { ROOT } from '@/CONSTS'
import type { TInitOpts } from '@/utils/types'

async function init({
    projectDir,
    projectName,
    packageManager,
    applications,
    orm,
    database,
}: TInitOpts) {
    await baseSetup({ projectName, projectDir, packageManager })

    if (packageManager === 'pnpm') {
        // copy over the pnpm workspaces file for monorepo setup
        fse.copyFileSync(
            path.join(ROOT, 'template/pnpm-workspace.yaml'),
            path.join(projectDir, 'pnpm-workspace.yaml')
        )
    } else {
        // if package manager is anything except pnpm
        // set workspaces in `package.json`
        const packageJSON = fse.readJSONSync(
            path.resolve(projectDir, 'package.json')
        )

        packageJSON['workspaces'].push('apps/*', 'packages/*', 'tooling/*')
        fse.writeJsonSync(path.join(projectDir, 'package.json'), packageJSON, {
            spaces: 4,
        })
    }

    if (applications?.includes('vite')) {
        vite({ projectName, projectDir, packageManager })
    }

    if (applications?.includes('express')) {
        addExpressApp({ projectName, projectDir, packageManager })
    }

    if (applications?.includes('next')) {
        next({ projectName, projectDir, packageManager })
    }

    if (orm !== 'none') {
        addDatabase({ projectName, projectDir, packageManager, orm, database })
    }
}

export { init }
