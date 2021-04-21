import { Router } from 'express'
import { register, login, refreshToken } from './auth'
const loginRoute = Router()


loginRoute.post('/register', register)
loginRoute.post('/login', login)
loginRoute.get('/token', refreshToken)

export default loginRoute