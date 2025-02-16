import { sql } from 'drizzle-orm'
import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
    id: int('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
})

export const posts = sqliteTable('posts', {
    id: int('id').primaryKey({ autoIncrement: true }),
    title: text('title').notNull(),
    userId: int('user_id')
        .notNull()
        .references(() => users.id, {
            onDelete: 'cascade',
            onUpdate: 'cascade',
        }),
    createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
})
