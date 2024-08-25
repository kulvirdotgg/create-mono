import { createBase } from './base-setup'

async function init(projectName: string) {
    await createBase(projectName)
}

export { init }
