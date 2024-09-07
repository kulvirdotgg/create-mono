import fs from 'fs'
import path from 'path'

/*
    oh Theo my savior. Whenever I have some issue your OSS comes to my help
*/

function replaceTextInFiles(
    directory: string,
    search: string,
    replacement: string,
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
                replacement,
            )
            fs.writeFileSync(filePath, updatedData, 'utf8')
        }
    })
}

const updateImportAlias = (projectDir: string, importAlias: string) => {
    const normalizedImportAlias = importAlias
        .replace(/\*/g, '')
        .replace(/[^\/]$/, '$&/') // ensure trailing slash (@ -> ~/)

    replaceTextInFiles(projectDir, `@/`, normalizedImportAlias)
}

/*
    Remove the trailing `/` for vite config too
    @/ -> @
*/
const updateViteAlias = (viteConfigPath: string, importAlias: string) => {
    const normalizedImportAlias = importAlias
        .replace(/\*/g, '')
        .replace(/\//g, '')

    const data = fs.readFileSync(viteConfigPath, 'utf8')
    const updatedData = data.replace(/@'/g, `${normalizedImportAlias}'`)
    fs.writeFileSync(viteConfigPath, updatedData, 'utf8')
}

export { updateImportAlias, updateViteAlias }
