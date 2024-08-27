import { Router } from 'express'

const router = Router()

router
    .get('/hello', (_, res) => {
        res.status(200).json({ 69: 420 })
    })
    .get('/status', (_, res) => {
        res.status(200).json({ msg: 'Skill Isssues :p' })
    })

export { router }
