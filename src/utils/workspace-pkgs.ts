import path from 'node:path'
import fse from 'fs-extra'

// bun and pnpm uses `"dep": "workspace:*"` for local packages
function updateWorkspacePkgs(appDir: string) {
    const packageJSON = fse.readJSONSync(path.resolve(appDir, 'package.json'))

    for (let [key, val] of Object.entries(packageJSON.dependencies)) {
        if (val === '*') packageJSON.devDependencies[key] = 'workspace:*'
    }

    for (let [key, val] of Object.entries(packageJSON.devDependencies)) {
        if (val === '*') packageJSON.devDependencies[key] = 'workspace:*'
    }

    fse.writeJsonSync(path.join(appDir, 'package.json'), packageJSON, {
        spaces: 4,
    })
}

export { updateWorkspacePkgs }
