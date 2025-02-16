import { seed } from 'drizzle-seed'

import { posts, users } from './db/schema'
import { db } from './index'

async function main() {
    console.log('starting the seeding')
    await seed(db, { users, posts }, { count: 10 })
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
