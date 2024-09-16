import { json, urlencoded } from 'body-parser'
import express, { type Express } from 'express'
import morgan from 'morgan'
import cors from 'cors'
import { config } from 'dotenv'

import { router } from '@/routes'

config({ path: '.env' })

const port = process.env.PORT!

const app: Express = express()
app.disable('x-powered-by')
    .use(morgan('dev'))
    .use(urlencoded({ extended: true }))
    .use(json())
    .use(cors())

app.use('/api', router)

app.listen(port, () => {
    console.log(`express api running happily on ${port}`)
})
