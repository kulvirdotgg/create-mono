import { basename } from 'node:path'

/*
 * - dir/@mono/app => ["@mono/app", "dir/app"]
 * - dir/app => ["app", "dir/app"]
 */
function pathDetails(input: string) {
    if (input.length > 1 && input.endsWith('/')) input = input.slice(0, -1)

    const paths = input.split('/')

    let repoName = paths[paths.length - 1]

    // `create-app .`
    if (repoName === '.') {
        const cwd = process.cwd()
        repoName = basename(cwd)
    }

    const idxDelimeter = paths.findIndex((p) => p.startsWith('@'))
    if (paths.findIndex((p) => p.startsWith('@')) !== -1) {
        repoName = paths.slice(idxDelimeter).join('/')
    }

    const path = paths.filter((p) => !p.startsWith('@')).join('/')

    return [repoName, path] as const
}

export { pathDetails }
