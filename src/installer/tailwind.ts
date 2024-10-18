import path from 'node:path'
import fse from 'fs-extra'

import type { TDependencies } from '../utils/dependencies'
import { addDependencies } from '../utils/add-dependencies'
import { ROOT } from '../CONSTS'

// appDir = repoName/apps/appName
function twInstaller(appDir: string) {
    // TODO: if tw stays update this one too
    const devPkg: TDependencies[] = [
        // 'tailwindcss',
        // 'autoprefixer',
        // 'postcss',
        // 'prettier-plugin-tailwindcss',
    ]
    addDependencies(devPkg, true, appDir)

    /*
    src
    |  globals.css
    tailwind.configs.ts
    postcss.config.cjs
    prettier.config.mjs
    */

    fse.copyFileSync(
        path.join(ROOT, 'prettier-config.mjs'),
        path.join(appDir, 'prettier.config.js')
    )
}

export { twInstaller }
