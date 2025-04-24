import { PrismaClient } from '../generated/client'

const prisma = new PrismaClient()

async function main() {
    const user1 = await prisma.user.create({
        data: {
            name: 'User1',
            email: 'user@test.dev',
            posts: {
                create: {
                    title: 'Why is this great?',
                },
            },
        },
    })
    const user2 = await prisma.user.create({
        data: {
            email: 'user2@test.dev',
            name: 'User2',
            posts: {
                create: [
                    {
                        title: 'Great Tweet battles',
                    },
                ],
            },
        },
    })
    console.log('users inserted in db are:\n', { user1, user2 })
}

main()
    .then(async () => {
        const posts = await prisma.post.findMany()
        console.log('Posts in db are:\n', posts)

        await prisma.$disconnect()
        console.log('seeding done!!!')
    })
    .catch(async (err) => {
        console.log('some error in seeding the database')
        console.log(err)
        await prisma.$disconnect()
        process.exit(1)
    })
    .finally(() => {
        process.exit(0)
    })
