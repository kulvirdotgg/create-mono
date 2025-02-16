import { pgTable, varchar, serial, timestamp } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    name: varchar('name').notNull(),
    email: varchar('email').notNull(),
})

export const posts = pgTable('posts', {
    id: serial('id').primaryKey(),
    title: varchar('title').notNull(),
    userId: serial('user_id')
        .notNull()
        .references(() => users.id, {
            onDelete: 'cascade',
            onUpdate: 'cascade',
        }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
        .notNull()
        .$onUpdate(() => new Date()),
})
