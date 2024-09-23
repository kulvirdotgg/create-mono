import path from 'node:path'
import fse from 'fs-extra'
import { sortPackageJson } from 'sort-package-json'

import type { TOrm } from '@/cli'

// TODO: Maybe add database seed thing here tooo, yk it will be very nice, adds no value thoo

function updateTurboPkgJSON(projectDir: string, orm: TOrm) {
    const turboJSON = fse.readJSONSync(path.join(projectDir, 'turbo.json'))
    const rootPacakgeJSON = fse.readJSONSync(
        path.join(projectDir, 'package.json')
    )

    if (orm === 'prisma') {
        rootPacakgeJSON.scripts['db:generate'] = 'turbo run db:generate'
        rootPacakgeJSON.scripts['db:migrate:deploy'] =
            'turbo run migrate:deploy'
        rootPacakgeJSON.scripts['db:push'] = 'turbo run db:push'

        turboJSON.tasks['db:generate'] = {}
        turboJSON.tasks['db:migrate:deploy'] = {}
        turboJSON.tasks['db:push'] = {}
    } else if (orm === 'drizzle') {
        rootPacakgeJSON.scripts['db:generate'] = 'turbo run db:generate'
        rootPacakgeJSON.scripts['db:migrate'] = 'turbo run db:migrate'
        rootPacakgeJSON.scripts['db:push'] = 'turbo run db:push'

        turboJSON.tasks['db:generate'] = {}
        turboJSON.tasks['db:migrate'] = {}
        turboJSON.tasks['db:push'] = {}
    }
    const sortedTurboJSON = sortPackageJson(turboJSON)
    fse.writeJSONSync(path.join(projectDir, 'turbo.json'), sortedTurboJSON, {
        spaces: 4,
    })

    const sortedPackageJSON = sortPackageJson(rootPacakgeJSON)
    fse.writeJSONSync(
        path.join(projectDir, 'package.json'),
        sortedPackageJSON,
        {
            spaces: 4,
        }
    )
}

export { updateTurboPkgJSON }
