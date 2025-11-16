import { defineConfig, type Options } from 'tsup'

export default defineConfig((options: Options) => ({
    entryPoints: ['src/index.ts'],
    clean: true,
    format: ['cjs'],
    // Bundle the database package to handle extensionless TypeScript imports
    noExternal: ['@repo/database'],
    ...options,
}))
