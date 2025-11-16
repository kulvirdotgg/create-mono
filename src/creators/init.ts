import fse from 'fs-extra'
import path from 'path'

import { ROOT } from '@/CONSTS'
import type { TInitOpts } from '@/types'

import { baseSetup } from './base-setup'
import { addDatabase } from './database'
import { addExpressApp } from './express'
import { next } from './next'
import { vite } from './vite'
import { sortPackageJson } from 'sort-package-json'

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
        const sortedFile = sortPackageJson(packageJSON)
        fse.writeJsonSync(path.join(projectDir, 'package.json'), sortedFile, {
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
        
        // Add DATABASE_URL to Next.js .env.local if database was added
        if (applications?.includes('next') && database) {
            const nextEnvPath = path.join(projectDir, 'apps/next/.env.local')
            if (fse.existsSync(nextEnvPath)) {
                let envContent = fse.readFileSync(nextEnvPath, 'utf8')
                const dbUrl = database === 'mysql' 
                    ? `mysql://admin:password@localhost:3306/${projectName}`
                    : `postgresql://admin:password@localhost:5432/${projectName}`
                envContent += `DATABASE_URL=${dbUrl}\n`
                fse.writeFileSync(nextEnvPath, envContent, 'utf8')
            }
        }
        
        // Add DATABASE_URL to Express .env if database was added
        if (applications?.includes('express') && database) {
            const expressEnvPath = path.join(projectDir, 'apps/express/.env')
            if (fse.existsSync(expressEnvPath)) {
                let envContent = fse.readFileSync(expressEnvPath, 'utf8')
                const dbUrl = database === 'mysql' 
                    ? `mysql://admin:password@localhost:3306/${projectName}`
                    : `postgresql://admin:password@localhost:5432/${projectName}`
                envContent += `DATABASE_URL=${dbUrl}\n`
                fse.writeFileSync(expressEnvPath, envContent, 'utf8')
            }
        }
    }
}

export { init }
