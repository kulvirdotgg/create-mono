import { Router } from 'express'

const router = Router()

router
    .get('/hello', (_, res) => {
        res.status(200).json({ hello: 'world' })
    })
    .get('/status', (_, res) => {
        res.status(200).json({ msg: 'uWu oniii chan :p' })
    })

export { router }
