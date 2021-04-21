import { Router } from 'express'
import { register, login, passportLogin } from './auth'
import validateToken from '../middleware/authorization'
const loginRoute = Router()


loginRoute.post('/register', register)
loginRoute.post('/login', passportLogin)
loginRoute.get('/', validateToken, (_req, res) => {
    res.send("Temp")
})


export default loginRoute