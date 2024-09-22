import { execa } from 'execa'

async function runInstall(projectDir: string, packageManager: string) {
    await execa(packageManager, ['install'], {
        cwd: projectDir,
        stderr: 'inherit',
    })
}

export { runInstall }
