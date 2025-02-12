import express, { type Express } from 'express'
import cors from 'cors'
import { config } from 'dotenv'

import { router } from '@/routes'

config()

const PORT = process.env.PORT || 42069

const app: Express = express()
app.use(cors())

app.use('/api/v1', router)

app.listen(PORT, () => {
    console.log(`express api running happily on ${PORT}`)
})
