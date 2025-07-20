import cors from 'cors'
import express, { type Express, json, urlencoded } from 'express'

import { router } from '@/routes'
import { requestLogger, errorLogger } from '@/middlewares/logging'

function createServer(): Express {
    const app: Express = express()
    app.disable('x-powered-by')
    app.use(urlencoded())
    app.use(cors())
    app.use(json())
    app.use(requestLogger)

    app.use('/api/v1', router)

    app.use(errorLogger)

    return app
}

export { createServer }
