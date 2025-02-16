import fs from 'node:fs'
import path from 'node:path'

function replaceTextInFiles(
    directory: string,
    search: string,
    replacement: string
) {
    const files = fs.readdirSync(directory)

    files.forEach((file) => {
        const filePath = path.join(directory, file)

        if (fs.statSync(filePath).isDirectory()) {
            replaceTextInFiles(filePath, search, replacement)
        } else {
            const data = fs.readFileSync(filePath, 'utf8')
            const updatedData = data.replace(
                new RegExp(search, 'g'),
                replacement
            )
            fs.writeFileSync(filePath, updatedData, 'utf8')
        }
    })
}

function updateImportAlias(projectDir: string, importAlias: string) {
    const normalizedImportAlias = importAlias
        .replace(/\*/g, '')
        .replace(/[^\/]$/, '$&/') // ensure trailing slash (@ -> ~/)

    // by default `@/` import alias is used
    replaceTextInFiles(projectDir, `@/`, normalizedImportAlias)
}

/*
    Remove the trailing `/` for vite config too
    @/ -> @
*/
function updateViteAlias(viteConfigPath: string, importAlias: string) {
    const normalizedImportAlias = importAlias
        .replace(/\*/g, '')
        .replace(/\//g, '')

    const data = fs.readFileSync(viteConfigPath, 'utf8')
    // certain packages also start with `@/library` so it will replace that too
    // instead check for `'@'` type of pattern to replace
    const updatedData = data.replace(/@'/g, `${normalizedImportAlias}'`)
    fs.writeFileSync(viteConfigPath, updatedData, 'utf8')
}

export { updateImportAlias, updateViteAlias }
