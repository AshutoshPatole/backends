import express from 'express'
import connectDb from './DB/connectDb'
import loginRoute from './routes'
const app = express()

require('dotenv').config()
app.use(express.json())

connectDb()
app.use('/auth', loginRoute)
const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
    console.log(`[INFO] Live at ${PORT}`)
})