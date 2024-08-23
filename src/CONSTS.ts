import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const ROOT = path.join(path.dirname(__filename), '../')

const DEFAULT_NAME = 'mono'

export { ROOT, DEFAULT_NAME }
