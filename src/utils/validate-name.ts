/*
    /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/
    Thanks **THEO** I got this from your T3 code.
    Might use in future if I ever get educated about scoped packages.
*/

const re = /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/

function validateName(input: string) {
    if (input.length > 1 && input.endsWith('/')) {
        input = input.slice(0, -1)
    }

    const paths = input.split('/')

    const idxDelimeter = paths.findIndex((p) => p.startsWith('@'))

    let name = paths[paths.length - 1]
    if (paths.findIndex((p) => p.startsWith('@')) !== -1) {
        name = paths.slice(idxDelimeter).join('/')
    }

    if (input === '.' || re.test(name ?? '')) {
        return
    } else {
        return "App name must consist of only lowercase alphanumeric characters, '-', and '_'"
    }
}

export { validateName }
