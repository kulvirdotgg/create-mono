import path from 'node:path'

/*
return [path, name]
name is what is to be put in package.json file
path is the path where project is created
*/
function pathDetails(input: string) {
    if (input.length > 1 && input.endsWith('/')) input = input.slice(0, -1)

    // "dir/code/app_name" => ["dir", "code', "app_name"]
    const dirs = input.split('/')

    let name = dirs[dirs.length - 1]

    if (name === '.') {
        const cwd = process.cwd()
        name = path.basename(cwd)
    }
    const pth = dirs.join('/')

    return [pth, name] as const
}

export { pathDetails }

// const validationRegExp =
//     /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/
// if (input === '.' || validationRegExp.test(input)) {
//     return
// } else {
//     return "App name must consist of only lowercase alphanumeric characters, '-', and '_'"
// }
