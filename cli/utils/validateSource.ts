const validationRegExp =
    /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/

function validateSource(input: string) {
    if (input.length > 1 && input.endsWith('/')) {
        input = input.slice(0, -1)
    }

    if (input === '.' || validationRegExp.test(input)) {
        return
    } else {
        return "App name must consist of only lowercase alphanumeric characters, '-', and '_'"
    }
}

export { validateSource }
