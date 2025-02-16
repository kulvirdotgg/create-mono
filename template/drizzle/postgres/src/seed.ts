import { seed } from 'drizzle-seed'

import { db } from './index'
import * as schema from './db/schema'

async function main() {
    console.log('starting the seeding')
    await seed(db, { schema }, { count: 10 })
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
