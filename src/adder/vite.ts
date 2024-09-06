import fs from 'fs'
import path from 'path'

import type { TVite } from '../cli/deps'
import { twInstaller } from '../installer/tailwind'
import { ROOT } from '../CONSTS'

function addViteDependencies(appDir: string, vite: TVite) {
    const tw = vite?.tailwind

    const pagesDir = path.join(ROOT, 'template/applications/pages')

    if (tw) {
        fs.copyFileSync(
            path.join(pagesDir, 'vite-tw.tsx'),
            path.join(appDir, 'src/app/index.tsx'),
        )
        twInstaller(appDir)
    }
}

export { addViteDependencies }
