export type TPackageManager = 'bun' | 'npm' | 'pnpm' | 'yarn'

export type TApplication = 'astro' | 'express' | 'next' | 'vite' | 'rn'

export type TOrm = 'drizzle' | 'none' | 'prisma'

export type TDatabase = 'postgres' | 'sqlite'

export type TInitOpts = {
    projectName: string
    projectDir: string
    packageManager?: TPackageManager
    applications?: TApplication[]
    database?: TDatabase
    orm?: TOrm
}
