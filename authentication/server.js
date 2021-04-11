import express from 'express'
import loginRoute from './routes'
const app = express()

require('dotenv').config()

app.use('/auth', loginRoute)
const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
    console.log(`[INFO] Live at ${PORT}`)
})