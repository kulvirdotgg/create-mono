import { basename } from 'node:path'

/*
    dir/@mono/app => ["@mono/app", "dir/app"]
    dir/app => ["app", "dir/app"]
*/
function pathDetails(input: string) {
    if (input.length > 1 && input.endsWith('/')) input = input.slice(0, -1)

    const paths = input.split('/')

    let monorepoName = paths[paths.length - 1]

    // when user runs `create-app .`
    if (monorepoName === '.') {
        const cwd = process.cwd()
        monorepoName = basename(cwd)
    }

    const idxDelimeter = paths.findIndex((p) => p.startsWith('@'))
    if (paths.findIndex((p) => p.startsWith('@')) !== -1) {
        monorepoName = paths.slice(idxDelimeter).join('/')
    }

    const pathToProject = paths.filter((p) => !p.startsWith('@')).join('/')

    return [monorepoName, pathToProject] as const
}

export { pathDetails }
