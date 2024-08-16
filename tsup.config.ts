import { defineConfig } from 'tsup'

const isDev = process.env.npm_lifecycle_event === 'dev'

export default defineConfig({
    clean: true,
    entry: ['cli/index.ts'],
    format: ['esm'],
    minify: !isDev,
    target: 'esnext',
    outDir: 'dist',
    onSuccess: isDev ? 'bun dist/index.js' : undefined,
})
