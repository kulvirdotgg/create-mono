import { serial, text, timestamp, pgTableCreator } from 'drizzle-orm/pg-core'

/*
    MULTI PROJECT SCHEMA
    https://orm.drizzle.team/docs/goodies#multi-project-schema
*/
const pgTable = pgTableCreator((name) => `mono_express_${name}`)

export const postsTable = pgTable('posts_table', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
        .notNull()
        .$onUpdate(() => new Date()),
})
