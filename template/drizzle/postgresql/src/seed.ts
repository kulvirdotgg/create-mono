import { eq } from 'drizzle-orm'
import { seed } from 'drizzle-seed'

import { posts, users } from './db/schema'
import { db } from './index'

async function main() {
    console.log('starting the seeding')
    await seed(db, { users, posts }, { count: 10 })
    console.log('seeding done!!!')

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
    .catch((err) => {
        console.log('some error in seeding the database')
        console.log(err)
        process.exit(1)
    })
    .finally(() => {
        process.exit(0)
    })
