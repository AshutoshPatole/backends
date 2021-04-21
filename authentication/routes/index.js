import { Router } from 'express'
import { register, login, refreshToken } from './auth'
import validateToken from '../middleware/authorization'
const loginRoute = Router()


loginRoute.post('/register', register)
loginRoute.post('/login', login)
loginRoute.get('/token', refreshToken)

export default loginRoute