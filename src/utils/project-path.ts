import { basename } from 'node:path'

/**
 * Extract project name and project directory from the project path entered by user.
 * Ignore the scoped naming because, I believe that monorepo's name shouln't be scoped.
 *
 * dir/app => ["app", "dir/app"]
 * dir/@mono/app => ["app", "dir/app"]
 */
function getProjectPath(input: string) {
    if (input.length > 1 && input.endsWith('/')) input = input.slice(0, -1)

    const paths = input.split('/')

    let projectName = paths[paths.length - 1]

    // when user runs `create-app .`
    if (projectName === '.') {
        const cwd = process.cwd()
        projectName = basename(cwd)
    }

    const projectDir = paths.filter((p) => !p.startsWith('@')).join('/')

    return [projectName, projectDir] as const
}

export { getProjectPath }
