import { defineConfig, type Options } from 'tsup'

export default defineConfig((options: Options) => ({
    entryPoints: ['src/index.ts'],
    clean: true,
    /**
     * CJS libraries can't be bundled well into ESM context (esbuild issues).
     * If your dependencies don't have such issue then you can use format 'esm' and set type as module in 'package.json'.
     */
    format: ['cjs'],
    target: 'node23',
    ...options,
}))
