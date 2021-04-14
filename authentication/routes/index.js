import { Router } from 'express'
import { register, login } from './auth'
const loginRoute = Router()


loginRoute.post('/register', register)
loginRoute.post('/login', login)


export default loginRoute