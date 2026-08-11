require('dotenv').config()
const express = require('express')
const authRouter = require('../backend/src/routes/authRoute')
const mongooseDatabase = require('../backend/src/configs/mongoDb')
const app = express()



mongooseDatabase()

app.use(express.json())
app.use('/api', authRouter)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`server running on: http://localhost:${PORT}`)
})
