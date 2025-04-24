import { PrismaClient } from '../generated/client'

const prisma = new PrismaClient()

async function main() {
    await prisma.user.create({
        data: {
            name: 'John',
            email: 'john@example.com',
            posts: {
                create: {
                    title: 'W title?',
                },
            },
        },
    })
    await prisma.user.create({
        data: {
            email: 'jake@example.dev',
            name: 'Jake',
            posts: {
                create: [
                    {
                        title: 'Just title?',
                    },
                ],
            },
        },
    })
    console.log('seeding done!!!')

    const postsWithUser = await prisma.post.findMany({
        relationLoadStrategy: 'join',
        include: {
            user: true,
        },
    })
    console.log('Getting posts with useer from the database: ', postsWithUser)
}

main()
    .then(async () => {
        await prisma.$disconnect()
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
