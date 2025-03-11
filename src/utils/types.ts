import type { TApplication, TDatabase, TOrm, TPackageManager } from '@/cli'

export type TInitOpts = {
    projectName: string
    projectDir: string
    packageManager?: TPackageManager
    applications?: TApplication[]
    database?: TDatabase
    orm?: TOrm
}
