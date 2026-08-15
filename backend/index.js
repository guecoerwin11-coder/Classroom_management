require('dotenv').config()
const app = require('../backend/src/app')
const mongooseDatabase = require('../backend/src/configs/mongoDb')

mongooseDatabase()

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`server running on: http://localhost:${PORT}`)
})
