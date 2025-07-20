import { defineConfig, type Options } from 'tsup'

export default defineConfig((options: Options) => ({
    entryPoints: ['src/index.ts'],
    clean: true,
    format: ['cjs'],
    noExternal: ['@repo/database'],
    ...options,
}))
