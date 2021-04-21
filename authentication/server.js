import express from 'express'
import session from 'express-session'
import connectDb from './DB/connectDb'
import loginRoute from './routes'
import dotenv from 'dotenv';
import validateToken from './middleware/authorization'
import passport from 'passport'
import passportConfig from './routes/passportConfig'


const app = express()

dotenv.config()

// Middlewares
app.use(express.json())
app.use(
    session({
        secret: process.env.SECRET_KEY,
        resave: true,
        saveUninitialized: true,
    })
);
passportConfig(passport)
app.use(passport.initialize())
app.use(passport.session())

connectDb()

app.get('/', (req, res) => {
    if (req.user == null) return res.send("login again")
    return res.send(req.user)
})

app.post('/temp', validateToken, (_req, res) => {
    res.send("Hello")
})

app.use('/auth', loginRoute)
const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
    console.log(`[INFO] Live at ${PORT}`)
})