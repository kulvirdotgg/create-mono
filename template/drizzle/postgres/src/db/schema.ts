import { pgTable, varchar, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    user_name: varchar('user_name').notNull(),
    email: varchar('email').notNull(),
})

export const posts = pgTable('posts', {
    id: serial('id').primaryKey(),
    title: varchar('title').notNull(),
    user_id: serial('user_id').references(() => users.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
    }),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at')
        .notNull()
        .$onUpdate(() => new Date()),
})
