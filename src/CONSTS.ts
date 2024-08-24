import path from 'node:path'
import { fileURLToPath } from 'node:url'

// absolute file URL, so that can load template from anywhere (cloud)
const __filename = fileURLToPath(import.meta.url)
const ROOT = path.join(path.dirname(__filename), '../')

const DEFAULT_NAME = 'mono'

export { ROOT, DEFAULT_NAME }
