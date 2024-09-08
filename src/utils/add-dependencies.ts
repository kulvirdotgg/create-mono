import path from 'node:path'
import fse from 'fs-extra'
import sortPackageJson from 'sort-package-json'

import { dependencyMap, type TDependencies } from './dependencies'

function addDependencies(
    dependencies: TDependencies[],
    devDep: boolean,
    projectDir: string
) {
    const packageJSON = fse.readJSONSync(path.join(projectDir, 'package.json'))

    dependencies.forEach((dep) => {
        const version = dependencyMap[dep]

        if (devDep) {
            packageJSON.devDependencies[dep] = version
        } else {
            packageJSON.dependencies[dep] = version
        }
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
