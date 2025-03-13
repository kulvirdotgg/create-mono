import { execSync } from 'child_process'
import path from 'path'
import * as p from '@clack/prompts'
import chalk from 'chalk'
import { execa } from 'execa'
import fs from 'fs-extra'
import ora from 'ora'

/**
 * https://github.com/t3-oss/create-t3-app/blob/main/LICENSE
 */
function isGitInstalled(projectDir: string) {
    try {
        execSync('git --version', { cwd: projectDir })
        return true
    } catch {
        return false
    }
}

function isRootGitRepo(projectDir: string) {
    return fs.existsSync(path.join(projectDir, '.git'))
}

async function isInsideGitRepo(projectDir: string) {
    try {
        await execa('git', ['rev-parse', '--is-inside-work-tree'], {
            cwd: projectDir,
            stdout: 'ignore',
        })
        return true
    } catch {
        return false
    }
}

export const initializeGit = async (projectDir: string) => {
    console.log(chalk.cyan('Initializing Git...'))

    if (!isGitInstalled(projectDir)) {
        console.log(
            chalk.yellow('Git is not installed. Skipping Git initialization.')
        )
        return
    }

    const spinner = ora('Creating a new git repo...\n').start()

    const isRoot = isRootGitRepo(projectDir)
    const isInside = await isInsideGitRepo(projectDir)
    const dirName = path.parse(projectDir).name

    if (isInside && isRoot) {
        // Dir is a root git repo
        spinner.stop()
        const overwriteGit = await p.confirm({
            message: `${chalk.redBright.bold(
                'Warning:'
            )} Git is already initialized in "${dirName}". Initializing a new git repository would delete the previous history. Would you like to continue anyways?`,
            initialValue: false,
        })

        if (!overwriteGit) {
            spinner.info('Skipping Git initialization.')
            return
        }
        fs.removeSync(path.join(projectDir, '.git'))
    } else if (isInside && !isRoot) {
        // Dir is inside a git worktree
        spinner.stop()
        const initializeChildGitRepo = await p.confirm({
            message: `${chalk.redBright.bold(
                'Warning:'
            )} "${dirName}" is already in a git worktree. Would you still like to initialize a new git repository in this directory?`,
            initialValue: false,
        })
        if (!initializeChildGitRepo) {
            spinner.info('Skipping Git initialization.')
            return
        }
    }

    try {
        await execa('git', ['init'], {
            cwd: projectDir,
        })
        await execa('git', ['add', '.'], { cwd: projectDir })
        spinner.succeed(
            `${chalk.green('Successfully initialized and staged')} ${chalk.green.bold(
                'git'
            )}\n`
        )
    } catch {
        // Safeguard, should be unreachable
        spinner.fail(
            `${chalk.bold.red(
                'Failed:'
            )} could not initialize git. Update git to the latest version!\n`
        )
    }
}
