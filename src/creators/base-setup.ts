import chalk from 'chalk'
import { execa } from 'execa'
import fse from 'fs-extra'
import ora from 'ora'
import path from 'node:path'
import * as p from '@clack/prompts'

import { ROOT } from '@/CONSTS'
import type { TInitOpts } from '@/types'

async function baseSetup({
    projectName,
    projectDir,
    packageManager,
}: TInitOpts) {
    const spin = ora(
        `Initializing monorepo in: ${chalk.bold(projectDir)}...\n`
    ).start()

    if (fse.existsSync(projectDir)) {
        if (fse.readdirSync(projectDir).length === 0) {
            if (projectDir !== '.') {
                spin.warn(
                    `${chalk.bold.cyan(projectDir)} present but empty, continuing...\n'`
                )
            }
        } else {
            spin.stopAndPersist()

            const overwrite = await p.select({
                message: `${chalk.redBright.bold('warning: ')}${chalk.bold.cyan(projectDir)} exists, Still wanna proceed?}`,
                options: [
                    {
                        label: 'Stop installation (recommended)',
                        value: 'abort',
                    },
                    {
                        label: 'Clear the directory and continue...',
                        value: 'clear',
                    },
                    {
                        label: 'Overwrite conflicting files...',
                        value: 'overwrite',
                    },
                ],
                initialValue: 'abort',
            })
            if (overwrite === 'abort') {
                spin.fail('Aborting...')
                process.exit(1)
            }

            const action =
                overwrite === 'clear'
                    ? 'clear the directory'
                    : 'overwrite conflicting files'

            const confirmOverwrite = await p.confirm({
                message: `Are you sure you want to ${action}`,
                initialValue: false,
            })

            if (!confirmOverwrite) {
                spin.fail('Aborting...')
                process.exit(1)
            }

            if (overwrite === 'clear') {
                spin.info(
                    `clearing ${chalk.cyan.bold(projectDir)} and continuing...`
                )
                fse.emptyDirSync(projectDir)
            }
            spin.stopAndPersist()
        }
    }
    spin.start()

    // copy the base template for monorepo
    const base = path.join(ROOT, 'template/base')
    fse.copySync(base, projectDir)

    fse.renameSync(
        path.join(projectDir, '_prettierconfig.js'),
        path.join(projectDir, 'prettier.config.js')
    )
    fse.renameSync(
        path.join(projectDir, '_gitignore'),
        path.join(projectDir, '.gitignore')
    )
    fse.renameSync(
        path.join(projectDir, '_prettierignore'),
        path.join(projectDir, '.prettierignore')
    )

    // choose proper scoped name for eslint package
    // @repo-name/eslint
    const eslintPath = path.join(projectDir, 'tooling/eslint', 'package.json')
    const eslintPkgJSON = fse.readJSONSync(eslintPath)
    eslintPkgJSON.name = `@${projectName}/eslint`
    fse.writeJsonSync(eslintPath, eslintPkgJSON, {
        spaces: 4,
    })

    // choose proper scoped name for tsconfig package
    // @repo-name/tsconfig
    const tsPath = path.join(projectDir, 'tooling/tsconfig', 'package.json')
    const tsPkgJSON = fse.readJSONSync(tsPath)
    tsPkgJSON.name = `@${projectName}/tsconfig`
    fse.writeJsonSync(tsPath, tsPkgJSON, {
        spaces: 4,
    })

    // choose proper scoped name for utils package
    // @repo-name/utils
    const utilsPath = path.join(projectDir, 'packages/utils', 'package.json')
    const utilsPkgJSON = fse.readJSONSync(utilsPath)
    utilsPkgJSON.name = `@${projectName}/utils`

    // Update devDependencies to use correct package names
    delete utilsPkgJSON.devDependencies['@repo/eslint']
    delete utilsPkgJSON.devDependencies['@repo/tsconfig']
    utilsPkgJSON.devDependencies[`@${projectName}/eslint`] = '*'
    utilsPkgJSON.devDependencies[`@${projectName}/tsconfig`] = '*'

    fse.writeJsonSync(utilsPath, utilsPkgJSON, {
        spaces: 4,
    })

    // Update utils package tsconfig to use correct package name
    const utilsTsconfigPath = path.join(
        projectDir,
        'packages/utils',
        'tsconfig.json'
    )
    const utilsTsconfig = fse.readJSONSync(utilsTsconfigPath)
    utilsTsconfig['extends'] = `@${projectName}/tsconfig/base.json`
    fse.writeJsonSync(utilsTsconfigPath, utilsTsconfig, {
        spaces: 4,
    })

    // Update utils package eslint config to use correct package name
    const utilsEslintPath = path.join(
        projectDir,
        'packages/utils',
        'eslint.config.js'
    )
    const utilsEslintData = fse.readFileSync(utilsEslintPath, 'utf8')
    const updatedUtilsEslintData = utilsEslintData.replace(
        new RegExp('@repo', 'g'),
        `@${projectName}`
    )
    fse.writeFileSync(utilsEslintPath, updatedUtilsEslintData, 'utf8')

    try {
        // set the name of repo in package.json
        const packageJSON = fse.readJSONSync(
            path.join(projectDir, 'package.json')
        )
        packageJSON.name = projectName

        // set package manager field in root package.json
        const { stdout } = await execa(packageManager!, ['-v'], {
            cwd: projectDir,
        })
        packageJSON.packageManager = packageManager + '@' + stdout.trim()

        fse.writeJsonSync(path.join(projectDir, 'package.json'), packageJSON, {
            spaces: 4,
        })
    } catch (err: unknown) {
        throw new Error('ERR_NO_PKG_MANAGER')
    }

    spin.succeed(`${chalk.cyan.bold(projectName)} initialized successfully!\n`)
}

export { baseSetup }
