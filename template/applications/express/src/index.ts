import { json, urlencoded } from 'body-parser'
import express, { type Express } from 'express'
import morgan from 'morgan'
import cors from 'cors'

const port = process.env.PORT || 42069

const app: Express = express()
app.disable('x-powered-by')
    .use(morgan('dev'))
    .use(urlencoded({ extended: true }))
    .use(json())
    .use(cors())

app.get('/status', (_, res) => {
    return res.status(200).json({ message: 'Skill Issues' })
})

app.listen(port, () => {
    console.log(`express api running happy and healthy on ${port}`)
})
