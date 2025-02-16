import path from 'node:path'
import fse from 'fs-extra'
import sortPackageJson from 'sort-package-json'

import {
    ScriptsMap,
    type TScripts,
    type TExports,
    ExportsMap,
} from './fields-map'

function addScripts(scripts: TScripts[], projectDir: string) {
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

function addExports(exports: TExports[], projectDir: string) {
    const packageJSON = fse.readJSONSync(path.join(projectDir, 'package.json'))

    exports.forEach((e) => {
        const { name, exp } = ExportsMap[e]
        packageJSON.exports[name] = exp
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

export { addScripts, addExports }
