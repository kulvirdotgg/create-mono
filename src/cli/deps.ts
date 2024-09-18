import * as p from '@clack/prompts'
import chalk from 'chalk'

async function deps(apps: string[]) {
    p.note(chalk.greenBright.bold('Adding dependencies for your applications'))

    const express: TExpress = apps.includes('express')
        ? await expressResponse()
        : null

    const vite: TVite = apps.includes('vite') ? await viteReponse() : null

    return { express: express, vite: vite }
}

export { deps }

async function expressResponse() {
    const express = await p.group(
        {
            orm: () => {
                return p.select({
                    message: 'What Orm would you like to use for express app',
                    options: [
                        { value: 'none', label: 'None' },
                        { value: 'drizzle', label: 'Drizzle' },
                        { value: 'prisma', label: 'Prisma' },
                    ],
                    initialValue: 'none',
                })
            },
            database: ({ results }) => {
                if (results.orm !== 'none') {
                    return p.select({
                        message: 'Select Database provider for express app',
                        options: [
                            { value: 'neon', label: 'Neon' },
                            { value: 'supabase', label: 'Supabase' },
                        ],
                        initialValue: 'neon',
                    })
                }
            },
        },
        {
            onCancel() {
                process.exit(0)
            },
        }
    )
    return express as TExpress
}

async function viteReponse() {
    const vite = await p.group(
        {
            tailwind: () => {
                return p.confirm({
                    message: 'Do you want to use tailwind in vite app?',
                })
            },
        },
        {
            onCancel() {
                process.exit(0)
            },
        }
    )
    return vite
}

export type TExpress = {
    orm: string
    database?: string
} | null

export type TVite = {
    tailwind: boolean
} | null
