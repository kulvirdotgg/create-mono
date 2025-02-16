import { eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/libsql'

import { posts, users } from './db/schema'
import { env } from './env'

async function main() {
    const db = drizzle({
        connection: {
            url: env.DATABASE_FILE_NAME,
        },
    })

    const user: typeof users.$inferInsert = {
        name: 'John',
        email: 'john@example.com',
    }
    await db.insert(users).values(user)
    console.log('New user created!')

    const post: typeof posts.$inferInsert = {
        userId: 1,
        title: 'W title',
    }
    await db.insert(posts).values(post)
    console.log('New post created!')

    const postsWithUser = await db
        .select()
        .from(posts)
        .innerJoin(users, eq(posts.userId, users.id))
    console.log(
        'Getting posts with their user from the database: ',
        postsWithUser
    )
}

main()
    .then(() => {
        console.log('seeding done!!!')
    })
    .catch((err) => {
        console.log('some error in seeding the database')
        console.log(err)
        process.exit(1)
    })
    .finally(() => {
        process.exit(0)
    })
