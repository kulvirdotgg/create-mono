import path from 'node:path'
import fse from 'fs-extra'

function updatePnpmWorkspace(appDir: string) {
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

export { updatePnpmWorkspace }
