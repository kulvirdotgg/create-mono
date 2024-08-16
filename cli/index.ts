#!/usr/bin/env node

import * as p from '@clack/prompts'
import chalk from 'chalk'

import { validateSource } from '@/utils/validateSource'

const pd = p.group(
    {
        name: () =>
            p.text({
                message: 'Name of your project',
                defaultValue: '.',
                validate: validateSource,
            }),
        pacMan: () => {
            return p.select({
                message: 'Choose your package manager',
                options: [
                    { value: 'npm', label: 'npm' },
                    { value: 'bun', label: 'Bun' },
                    // TODO: support pnpm and yarn too
                    {
                        value: 'pnpm',
                        label: chalk.redBright('pnpm'),
                        hint: 'Not supported yet',
                    },
                    {
                        value: 'yarn',
                        label: chalk.redBright('Yarn'),
                        hint: 'Not supported yet',
                    },
                ],
                initialValue: 'bun',
            })
        },
        // NOTE: Remove then when pnpm and yarn are supported
        _: ({ results }) => {
            if (results.pacMan === 'pnpm' || results.pacMan === 'yearn') {
                p.cancel(
                    chalk.redBright(
                        'Told yaa this package manager is not supported yet, I am working on it. Let me have sigh of relief',
                    ),
                )
                process.exit(0)
            }
        },
        apps: () => {
            return p.multiselect({
                message: 'What applications you want to have in your monorepo?',
                options: [
                    { value: 'vite', label: 'Vite single page app' },
                    { value: 'express', label: 'Express API' },
                    // TODO: add next and astro templates.
                    {
                        value: 'elysia',
                        label: chalk.redBright('Elysia API'),
                        hint: 'not available yet',
                    },
                    {
                        value: 'hono',
                        label: chalk.redBright('Hono API'),
                        hint: 'not available yet',
                    },
                    {
                        value: 'next',
                        label: chalk.redBright('Next App') + '(app router)',
                        hint: 'not available yet',
                    },
                ],
            })
        },
        //NOTE: Remove when next and astro template is added
        __: ({ results }) => {
            if (
                results.apps?.includes('hono') ||
                results.apps?.includes('elysia') ||
                results.apps?.includes('next')
            ) {
                p.cancel(
                    chalk.redBright(
                        'This framework is not yet supported, If needed create on your own.',
                    ),
                )
                process.exit(0)
            }
        },
        language: () => {
            return p.select({
                message:
                    'Will you be using Javascript or Typescript in all application?',
                options: [
                    { value: 'typescript', label: 'Typescript' },
                    {
                        value: 'javascript',
                        label: 'Javascript',
                        hint: 'Skill issues',
                    },
                ],
                initialValue: 'typescript',
            })
        },
        ___: ({ results }) => {
            if (results.language === 'javascript') {
                return p.note(
                    chalk.redBright(
                        'Skill issues, you will use only Typescript',
                    ),
                )
            }
        },
        uiPackage: () => {
            return p.confirm({
                message: `Do you want a shared ${chalk.cyan('ui')} package? (Tailwind w shad-cn)`,
            })
        },
        vitecss: ({ results }) => {
            if (!results.uiPackage && results.apps?.includes('vite')) {
                return p.confirm({
                    message:
                        'Will you be using Tailwind w shadcn in vite application?',
                })
            }
        },
        nextcss: ({ results }) => {
            if (!results.uiPackage && results.apps?.includes('next')) {
                return p.confirm({
                    message:
                        'Will you be using Tailwind w shadcn in vite application?',
                })
            }
        },
        expressDb: ({ results }) => {
            if (results.apps?.includes('express')) {
                return p.select({
                    message: `What database provider you would like to use for Express application?`,
                    options: [
                        { value: 'none', label: 'none' },
                        { value: 'neon', label: 'Neon Serveless' },
                        { value: 'supabase', label: 'Supabase' },
                    ],
                    initialValue: 'none',
                })
            }
        },
        elysiaDb: ({ results }) => {
            if (results.apps?.includes('elysia')) {
                return p.select({
                    message: `What database provider you would like to use for Elysia application?`,
                    options: [
                        { value: 'none', label: 'none' },
                        { value: 'neon', label: 'Neon Serveless' },
                        { value: 'supabase', label: 'Supabase' },
                    ],
                    initialValue: 'none',
                })
            }
        },
        honoDb: ({ results }) => {
            if (results.apps?.includes('hono')) {
                return p.select({
                    message: `What database provider you would like to use for Hono application?`,
                    options: [
                        { value: 'none', label: 'none' },
                        { value: 'neon', label: 'Neon Serveless' },
                        { value: 'supabase', label: 'Supabase' },
                    ],
                    initialValue: 'none',
                })
            }
        },
        nextDb: ({ results }) => {
            if (results.apps?.includes('next')) {
                return p.select({
                    message: `What database provider you would like to use for Next application?`,
                    options: [
                        { value: 'none', label: 'none' },
                        { value: 'neon', label: 'Neon Serveless' },
                        { value: 'supabase', label: 'Supabase' },
                    ],
                    initialValue: 'none',
                })
            }
        },
        expressOrm: ({ results }) => {
            if (results.expressDb) {
                return p.select({
                    message:
                        'What ORM would you like to use for Express application?',
                    options: [
                        { value: 'drizzle', label: 'Drizzle ORM' },
                        { value: 'prisma', label: 'Prisma ORM' },
                    ],
                    initialValue: 'drizzle',
                })
            }
        },
        elysiaOrm: ({ results }) => {
            if (results.elysiaDb) {
                return p.select({
                    message:
                        'What ORM would you like to use for Elysia application?',
                    options: [
                        { value: 'drizzle', label: 'Drizzle ORM' },
                        { value: 'prisma', label: 'Prisma ORM' },
                    ],
                    initialValue: 'drizzle',
                })
            }
        },
        honoOrm: ({ results }) => {
            if (results.honoDb) {
                return p.select({
                    message:
                        'What ORM would you like to use for Hono application?',
                    options: [
                        { value: 'drizzle', label: 'Drizzle ORM' },
                        { value: 'prisma', label: 'Prisma ORM' },
                    ],
                    initialValue: 'drizzle',
                })
            }
        },
        nextOrm: ({ results }) => {
            if (results.nextDb) {
                return p.select({
                    message:
                        'What ORM would you like to use for Next application?',
                    options: [
                        { value: 'drizzle', label: 'Drizzle ORM' },
                        { value: 'prisma', label: 'Prisma ORM' },
                    ],
                    initialValue: 'drizzle',
                })
            }
        },
    },
    {
        onCancel() {
            process.exit(0)
        },
    },
)
