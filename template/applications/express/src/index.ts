import { env } from '@/env'
import { createServer } from '@/server'

const app = createServer()

const PORT = env.PORT || 42069
app.listen(PORT, () => {
    console.log(`express api running happily on ${PORT}`)
})
