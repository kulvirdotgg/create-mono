import cors from 'cors'
import express, { type Express, json, urlencoded } from 'express'
import morgan from 'morgan'

import { router } from '@/routes'

function createServer(): Express {
    const app: Express = express()
    app.disable('x-powered-by')
    // user any logger of your chode
    app.use(morgan('dev'))
    app.use(urlencoded())
    app.use(json())
    app.use(cors())

    app.use('/api/v1', router)

    return app
}

export { createServer }
