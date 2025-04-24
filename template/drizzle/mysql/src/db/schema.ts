import { serial, timestamp, mysqlTable, varchar } from 'drizzle-orm/mysql-core'

export const users = mysqlTable('users', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 256 }).notNull(),
    email: varchar('email', { length: 256 }).notNull(),
})

export const posts = mysqlTable('posts', {
    id: serial('id').primaryKey(),
    title: varchar('title', { length: 256 }).notNull(),
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
