import chalk from 'chalk'
import { execa } from 'execa'
import ora, { type Ora } from 'ora'

import type { TPackageManager } from '@/types'

/**
 * https://github.com/t3-oss/create-t3-app/blob/main/LICENSE
 */

async function execWithSpinner(
    projectDir: string,
    packageManager: TPackageManager,
    options: {
        args?: string[]
        stdout?: any
        onDataHandle?: (spinner: Ora) => (data: Buffer) => void
    }
) {
    const { onDataHandle, args = ['install'], stdout = 'pipe' } = options

    const spinner = ora(`Running ${packageManager} install...`).start()
    const subprocess = execa(packageManager, args, { cwd: projectDir, stdout })

    await new Promise<void>((respect, disrespect) => {
        if (onDataHandle) {
            subprocess.stdout?.on('data', onDataHandle(spinner))
        }

        void subprocess.on('error', (e) => disrespect(e))
        void subprocess.on('close', () => respect())
    })

    return spinner
}

async function runInstallCommand(
    packageManager: TPackageManager,
    projectDir: string
): Promise<Ora | null> {
    switch (packageManager) {
        // When using bun, the stdout stream is ignored and the spinner is shown
        case 'bun':
            return execWithSpinner(projectDir, packageManager, {
                stdout: 'ignore',
            })
        // When using npm, inherit the stderr stream so that the progress bar is shown
        case 'npm':
            await execa(packageManager, ['install'], {
                cwd: projectDir,
                stderr: 'inherit',
            })

            return null
        // When using yarn or pnpm, use the stdout stream and ora spinner to show the progress
        case 'pnpm':
            return execWithSpinner(projectDir, packageManager, {
                onDataHandle: (spinner) => (data) => {
                    const text = data.toString()

                    if (text.includes('Progress')) {
                        spinner.text = text.includes('|')
                            ? (text.split(' | ')[1] ?? '')
                            : text
                    }
                },
            })
        case 'yarn':
            return execWithSpinner(projectDir, packageManager, {
                onDataHandle: (spinner) => (data) => {
                    spinner.text = data.toString()
                },
            })
    }
}

async function runInstall(projectDir: string, packageManager: TPackageManager) {
    console.log(chalk.cyan('Installing dependencies...'))

    const installSpinner = await runInstallCommand(packageManager, projectDir)

    // If the spinner was used to show the progress, use succeed method on it
    // If not, use the succeed on a new spinner
    const spinner = installSpinner ?? ora()
    spinner.succeed(chalk.green('Successfully installed dependencies!\n'))
}

export { runInstall }
