import path from 'node:path'
import fse from 'fs-extra'
import sortPackageJson from 'sort-package-json'

import { ScriptsMap, type Scripts } from './scripts-map'

function addScripts(scripts: Scripts[], projectDir: string) {
    const packageJSON = fse.readJSONSync(path.join(projectDir, 'package.json'))

    scripts.forEach((s) => {
        const { name, script } = ScriptsMap[s]
        packageJSON.scripts[name] = script
    })

    const sortedPackageJSON = sortPackageJson(packageJSON)
    fse.writeJSONSync(
        path.join(projectDir, 'package.json'),
        sortedPackageJSON,
        {
            spaces: 4,
        }
    )
}

export { addScripts }
