const express = require('express')
const app = express();
const authRouter = require('../src/routes/authRoute')
const classRouter = require('../src/routes/classRoute')

app.use(express.json())

app.use('/api/auth', authRouter)
app.use('/api', classRouter)

module.exports = app