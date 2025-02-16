import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const usersTable = sqliteTable('users', {
    id: int('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
})

export const postsTable = sqliteTable('posts', {
    id: int('id').primaryKey({ autoIncrement: true }),
    title: text('title').notNull(),
    userId: int('user_id')
        .notNull()
        .references(() => usersTable.id, {
            onDelete: 'cascade',
            onUpdate: 'cascade',
        }),
    createdAt: int('created_at', { mode: 'timestamp' })
        .notNull()
        .defaultCurrentTimestamp(),
    updatedAt: int('updated_at', { mode: 'timestamp' })
        .notNull()
        .defaultCurrentTimestamp(),
})
