import { Router } from 'express'

const router: Router = Router()

router.get('/status', (_, res) => {
    res.status(200).json({
        message: 'uWu oniii chan :p',
    })
})

export { router }
