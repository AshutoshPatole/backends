import { Router } from 'express'

const loginRoute = Router()


loginRoute.post('/login', (req, res) => {
    res.send("OK")
})


export default loginRoute