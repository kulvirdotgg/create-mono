/*
    /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/
    Thanks **THEO** I got this from your T3 code.
*/

const re = /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/

function validateName(input: string) {
    if (input.length > 1 && input.endsWith('/')) {
        input = input.slice(0, -1)
    }

    const paths = input.split('/')
    let name = paths[paths.length - 1]

    if (input === '.' || re.test(name ?? '')) {
        return
    } else {
        return "App name must consist of only lowercase alphanumeric characters, '-', and '_'"
    }
}

export { validateName }
