import { Router } from 'express'
import register from './auth'
const loginRoute = Router()


loginRoute.post('/login', register)


export default loginRoute