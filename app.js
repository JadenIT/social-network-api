require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const router = require('./routes/index')
const cookies = require('./middlewares/cookies')
const cors = require('./middlewares/cors')

var app = express()

app.use(cors)
app.use(express.static(__dirname));
app.use(cookies)
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/', router)

let server = app.listen(process.env.PORT || 8000, () => {
    console.log(`Server is running on port ${server.address().port}`)
})
