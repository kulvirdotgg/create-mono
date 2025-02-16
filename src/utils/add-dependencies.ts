import path from 'node:path'
import fse from 'fs-extra'
import sortPackageJson from 'sort-package-json'

import {
    dependencyMap,
    devDependencyMap,
    type TDependencies,
    type TDevDependencies,
} from './dependency-maps'

function addDependencies(
    dependencies: TDependencies[],
    devDepencies: TDevDependencies[],
    projectDir: string
) {
    const packageJSON = fse.readJSONSync(path.join(projectDir, 'package.json'))

    dependencies.forEach((dep) => {
        const version = dependencyMap[dep]
        packageJSON.dependencies[dep] = version
    })

    devDepencies.forEach((dep) => {
        const version = devDependencyMap[dep]
        packageJSON.devDependencies[dep] = version
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

export { addDependencies }
