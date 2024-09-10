import { Router } from 'express'

const router = Router()

router
    .get('/hello/:name', (req, res) => {
        const name = req.params.name
        res.status(200).json({ hello: name })
    })
    .get('/status', (_, res) => {
        res.status(200).json({ msg: 'uWu oniii chan :p' })
    })

export { router }
