import { basename } from 'node:path'

/*
 * - dir/@mono/app => ["@mono/app", "dir/app"]
 * - dir/app => ["app", "dir/app"]
 */
function pathDetails(input: string) {
    if (input.length > 1 && input.endsWith('/')) input = input.slice(0, -1)

    const paths = input.split('/')

    let name = paths[paths.length - 1]

    // `create-app .`
    if (name === '.') {
        const cwd = process.cwd()
        name = basename(cwd)
    }

    const idxDelimeter = paths.findIndex((p) => p.startsWith('@'))
    if (paths.findIndex((p) => p.startsWith('@')) !== -1) {
        name = paths.slice(idxDelimeter).join('/')
    }

    const path = paths.filter((p) => !p.startsWith('@')).join('/')

    return [name, path] as const
}

export { pathDetails }
